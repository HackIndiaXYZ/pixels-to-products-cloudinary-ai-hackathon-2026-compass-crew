/**
 * API Client for OmniStage AI Backend Services
 */

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

export interface UserResponse {
  id: string;
  email: string;
  full_name?: string | null;
  firebase_uid?: string | null;
  created_at?: string;
}

export interface TokenResponse {
  access_token: string;
  token_type: string;
  user: UserResponse;
}

export interface Product {
  id: string;
  user_id: string;
  product_name: string;
  category?: string | null;
  brand_id?: string | null;
  cloudinary_public_id: string;
  cloudinary_url: string;
  ai_metadata?: Record<string, unknown> | null;
  created_at: string;
  updated_at?: string | null;
}

export interface ProductCreate {
  product_name: string;
  category?: string;
  brand_id?: string;
  cloudinary_public_id: string;
  cloudinary_url: string;
  ai_metadata?: Record<string, unknown>;
}

export interface Brand {
  id: string;
  user_id: string;
  brand_name: string;
  primary_color?: string | null;
  secondary_color?: string | null;
  aesthetic?: string | null;
  lighting?: string | null;
  background_style?: string | null;
  created_at: string;
  updated_at?: string | null;
}

export interface BrandCreate {
  brand_name: string;
  primary_color?: string;
  secondary_color?: string;
  aesthetic?: string;
  lighting?: string;
  background_style?: string;
}

export interface BrandUpdate {
  brand_name?: string;
  primary_color?: string;
  secondary_color?: string;
  aesthetic?: string;
  lighting?: string;
  background_style?: string;
}

export interface GenerationRequest {
  selected_colors: string[];
  selected_formats: string[];
  selected_scene?: string;
  brand_id?: string | null;
}

export interface GenerationJob {
  id: string;
  product_id: string;
  status: "QUEUED" | "ANALYZING" | "GENERATING" | "TRANSFORMING" | "OPTIMIZING" | "COMPLETED" | "FAILED";
  selected_colors: string[];
  selected_formats: string[];
  progress_percent: number;
  current_step: string;
  error_message?: string | null;
  product_name?: string | null;
  product_image?: string | null;
  created_at: string;
  updated_at?: string | null;
}

export interface Asset {
  id: string;
  generation_job_id: string;
  product_id: string;
  colorway: string;
  format: string;
  cloudinary_public_id: string;
  cloudinary_url: string;
  width?: number | null;
  height?: number | null;
  created_at: string;
}

export interface AIAnalysisResult {
  product_name?: string;
  category?: string;
  material?: string;
  base_color?: string;
  detected_features?: string[];
  suggested_lighting?: string;
  suggested_environments?: string[];
  detail_locks?: string[];
  resolution?: string;
  aspect_ratio?: string;
  confidence?: number;
  [key: string]: unknown;
}

class ApiClient {
  private tokenKey = "omnistage_token";
  private userKey = "omnistage_user";

  getToken(): string | null {
    if (typeof window === "undefined") return null;
    return localStorage.getItem(this.tokenKey);
  }

  setSession(token: string, user: UserResponse): void {
    if (typeof window === "undefined") return;
    localStorage.setItem(this.tokenKey, token);
    localStorage.setItem(this.userKey, JSON.stringify(user));
  }

  clearSession(): void {
    if (typeof window === "undefined") return;
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.userKey);
  }

  getCachedUser(): UserResponse | null {
    if (typeof window === "undefined") return null;
    const raw = localStorage.getItem(this.userKey);
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  }

  /**
   * Exchanges verified Firebase ID token for FastAPI application JWT session
   */
  async exchangeFirebaseToken(idToken: string, timeoutMs = 10000): Promise<TokenResponse> {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);

    try {
      const res = await fetch(`${API_BASE_URL}/auth/firebase`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id_token: idToken }),
        signal: controller.signal,
      });

      if (!res.ok) {
        let errorDetail = "Backend authentication failed";
        try {
          const err = await res.json();
          errorDetail = err.detail || err.message || errorDetail;
        } catch {
          // use default
        }
        throw new Error(errorDetail);
      }

      const data: TokenResponse = await res.json();
      this.setSession(data.access_token, data.user);
      return data;
    } catch (err: unknown) {
      if (err instanceof DOMException && err.name === "AbortError") {
        throw new Error("Authentication is taking too long. Please try again.");
      }
      throw err;
    } finally {
      clearTimeout(timer);
    }
  }

  /**
   * Helper for authenticated API calls to existing backend routes
   */
  async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const token = this.getToken();
    const headers = new Headers(options.headers || {});

    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
    if (!headers.has("Content-Type") && !(options.body instanceof FormData)) {
      headers.set("Content-Type", "application/json");
    }

    const url = endpoint.startsWith("http")
      ? endpoint
      : `${API_BASE_URL}${endpoint.startsWith("/") ? "" : "/"}${endpoint}`;

    const res = await fetch(url, {
      ...options,
      headers,
    });

    if (res.status === 401) {
      this.clearSession();
      if (typeof window !== "undefined" && !window.location.pathname.includes("/login")) {
        // eslint-disable-next-line @next/next/no-location-assign-relative-destination
        window.location.href = "/login";
      }
      throw new Error("Session expired. Please log in again.");
    }

    if (!res.ok) {
      let message = `API Request failed with status ${res.status}`;
      try {
        const err = await res.json();
        message = err.detail || err.message || message;
      } catch {
        // use default
      }
      throw new Error(message);
    }

    return res.json();
  }

  // ==================== Products ====================
  async getProducts(): Promise<Product[]> {
    return this.request<Product[]>("/products/");
  }

  async getProduct(id: string): Promise<Product> {
    return this.request<Product>(`/products/${id}`);
  }

  async createProduct(data: ProductCreate): Promise<Product> {
    return this.request<Product>("/products/", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async deleteProduct(id: string): Promise<{ message: string }> {
    return this.request<{ message: string }>(`/products/${id}`, {
      method: "DELETE",
    });
  }

  async analyzeProduct(params: { product_id?: string; image_url?: string; product_name?: string }): Promise<AIAnalysisResult> {
    if (params.product_id) {
      return this.request<AIAnalysisResult>(`/products/${params.product_id}/analyze`, {
        method: "POST",
      });
    }
    return this.request<AIAnalysisResult>("/products/analyze", {
      method: "POST",
      body: JSON.stringify({
        image_url: params.image_url,
        product_name: params.product_name || "Product",
      }),
    });
  }

  // ==================== Cloudinary Upload ====================
  async uploadProductImage(file: File): Promise<{
    public_id: string;
    secure_url: string;
    width?: number;
    height?: number;
    format?: string;
  }> {
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "x6kxm6nz";
    const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "omnistage_products";

    // Try unsigned direct Cloudinary upload first if preset exists
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", uploadPreset);
      formData.append("folder", "omnistage/products");

      const directRes = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
        method: "POST",
        body: formData,
      });

      if (directRes.ok) {
        const data = await directRes.json();
        return {
          public_id: data.public_id,
          secure_url: data.secure_url,
          width: data.width,
          height: data.height,
          format: data.format,
        };
      }
    } catch {
      // Direct upload fallback to backend endpoint
    }

    // Backend server-side upload fallback
    const form = new FormData();
    form.append("file", file);
    return this.request<{
      public_id: string;
      secure_url: string;
      width?: number;
      height?: number;
      format?: string;
    }>("/cloudinary/upload-product", {
      method: "POST",
      body: form,
    });
  }

  // ==================== Brands ====================
  async getBrands(): Promise<Brand[]> {
    return this.request<Brand[]>("/brands/");
  }

  async getBrand(id: string): Promise<Brand> {
    return this.request<Brand>(`/brands/${id}`);
  }

  async createBrand(data: BrandCreate): Promise<Brand> {
    return this.request<Brand>("/brands/", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async updateBrand(id: string, data: BrandUpdate): Promise<Brand> {
    return this.request<Brand>(`/brands/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  async deleteBrand(id: string): Promise<{ success: boolean }> {
    return this.request<{ success: boolean }>(`/brands/${id}`, {
      method: "DELETE",
    });
  }

  // ==================== Generations ====================
  async triggerGeneration(productId: string, data: GenerationRequest): Promise<GenerationJob> {
    return this.request<GenerationJob>(`/generations/${productId}/generate`, {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async getJobStatus(jobId: string): Promise<GenerationJob> {
    return this.request<GenerationJob>(`/generations/${jobId}/status`);
  }

  async getGenerationJobs(): Promise<GenerationJob[]> {
    return this.request<GenerationJob[]>("/generations/");
  }

  // ==================== Assets ====================
  async getAssets(params?: { format?: string; color?: string }): Promise<Asset[]> {
    const query = new URLSearchParams();
    if (params?.format && params.format !== "all" && params.format !== "All") {
      query.set("format", params.format);
    }
    if (params?.color) {
      query.set("color", params.color);
    }
    const qs = query.toString();
    return this.request<Asset[]>(`/assets/${qs ? `?${qs}` : ""}`);
  }

  async getJobAssets(jobId: string): Promise<Asset[]> {
    return this.request<Asset[]>(`/assets/job/${jobId}`);
  }

  async getProductAssets(productId: string): Promise<Asset[]> {
    return this.request<Asset[]>(`/assets/product/${productId}`);
  }

  async deleteAsset(id: string): Promise<{ message: string }> {
    return this.request<{ message: string }>(`/assets/${id}`, {
      method: "DELETE",
    });
  }
}

export const api = new ApiClient();
export default api;
