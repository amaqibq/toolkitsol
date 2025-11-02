"use client";
import { useEffect, useState } from "react";
import { BlogPost } from "@/lib/blog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import dynamic from "next/dynamic";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Loader2, 
  Plus, 
  Edit, 
  Trash2, 
  Save, 
  X, 
  FileText, 
  Calendar, 
  User, 
  UploadCloud, 
  Image,
  Eye,
  Search,
  Filter,
  MoreVertical,
  CheckCircle,
  AlertCircle,
  Link,
  Tag,
  Settings
} from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

const MarkdownEditor = dynamic(() => import("react-simplemde-editor"), { ssr: false });

export default function AdminPage() {
  const [form, setForm] = useState<Partial<BlogPost>>({
    title: "",
    slug: "",
    date: new Date().toISOString().slice(0, 10),
    excerpt: "",
    coverImage: "",
    author: "",
    categories: [],
    tags: [],
    metaTitle: "",
    metaDescription: "",
    canonicalUrl: "",
    isIndexed: true,
    content: "",
  });

  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [editingSlug, setEditingSlug] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("edit");

  async function loadPosts() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/posts");
      if (!res.ok) throw new Error("Failed to load posts");
      const data = await res.json();
      setPosts(data);
    } catch (e: any) {
      setError(e?.message ?? "Failed to load posts");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadPosts();
  }, []);

  function resetForm() {
    setForm({
      title: "",
      slug: "",
      date: new Date().toISOString().slice(0, 10),
      excerpt: "",
      coverImage: "",
      author: "",
      categories: [],
      tags: [],
      metaTitle: "",
      metaDescription: "",
      canonicalUrl: "",
      isIndexed: true,
      content: "",
    });
    setEditingSlug(null);
    setSuccess(null);
    setError(null);
  }

  function showSuccess(message: string) {
    setSuccess(message);
    setTimeout(() => setSuccess(null), 4000);
  }

  async function handleSubmit() {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      if (editingSlug) {
        const res = await fetch(`/api/posts/${editingSlug}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
        if (!res.ok) throw new Error((await res.json()).error ?? "Failed to update");
        showSuccess("Post updated successfully!");
      } else {
        const res = await fetch("/api/posts", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
        if (!res.ok) throw new Error((await res.json()).error ?? "Failed to create");
        showSuccess("Post created successfully!");
      }
      await loadPosts();
      resetForm();
      setActiveTab("posts");
    } catch (e: any) {
      setError(e?.message ?? `Failed to ${editingSlug ? "update" : "create"} post`);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(slug: string) {
    if (!confirm("Are you sure you want to delete this post? This action cannot be undone.")) {
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/posts/${slug}`, { method: "DELETE" });
      if (!res.ok) throw new Error((await res.json()).error ?? "Failed to delete");
      await loadPosts();
      if (editingSlug === slug) resetForm();
      showSuccess("Post deleted successfully!");
    } catch (e: any) {
      setError(e?.message ?? "Failed to delete post");
    } finally {
      setLoading(false);
    }
  }

  function startEdit(p: BlogPost) {
    setEditingSlug(p.slug);
    setForm(p);
    setError(null);
    setSuccess(null);
    setActiveTab("edit");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  // ✅ Handle Cover Image Upload
  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError("Please select a valid image file");
      return;
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError("Image size should be less than 5MB");
      return;
    }

    setUploading(true);
    const fd = new FormData();
    fd.append("file", file);

    try {
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (res.ok && data.url) {
        setForm({ ...form, coverImage: data.url });
        showSuccess("Cover image uploaded successfully!");
      } else {
        setError(data.error || "Failed to upload image");
      }
    } catch {
      setError("Upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  }

  // Filter posts based on search
  const filteredPosts = posts.filter(post => 
    post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    post.author?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    post.categories?.some(cat => cat.toLowerCase().includes(searchQuery.toLowerCase())) ||
    post.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30 py-8">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
          <div className="mb-6 lg:mb-0">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
              Blog Admin
            </h1>
            <p className="text-slate-600 mt-2 text-lg">Manage your blog content with ease</p>
          </div>
          <div className="flex items-center gap-3">
            <Button 
              onClick={resetForm} 
              variant="outline" 
              className="flex items-center gap-2 border-slate-300 hover:bg-white"
            >
              <Plus className="h-4 w-4" />
              New Post
            </Button>
            <Button 
              onClick={loadPosts}
              variant="ghost" 
              size="icon"
              className="hover:bg-slate-200"
            >
              <Loader2 className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            </Button>
          </div>
        </div>

        {/* Notifications */}
        <div className="space-y-3 mb-6">
          {error && (
            <Alert variant="destructive" className="border-red-200 bg-red-50">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="text-red-800">{error}</AlertDescription>
            </Alert>
          )}
          {success && (
            <Alert className="border-green-200 bg-green-50">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">{success}</AlertDescription>
            </Alert>
          )}
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 p-1 bg-slate-100 rounded-lg">
            <TabsTrigger value="edit" className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm">
              <FileText className="h-4 w-4" />
              {editingSlug ? "Edit Post" : "Create Post"}
            </TabsTrigger>
            <TabsTrigger value="posts" className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm">
              <FileText className="h-4 w-4" />
              All Posts ({posts.length})
            </TabsTrigger>
          </TabsList>

          {/* ✅ Edit/Create Form */}
          <TabsContent value="edit" className="space-y-6">
            <Card className="border-slate-200 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader className="pb-4 bg-gradient-to-r from-slate-50 to-blue-50/50 border-b">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-2xl font-bold text-slate-900">
                      {editingSlug ? "Edit Blog Post" : "Create New Blog Post"}
                    </CardTitle>
                    <CardDescription className="text-slate-600 mt-1">
                      {editingSlug ? "Update your existing blog post content" : "Fill in the details to create a new blog post"}
                    </CardDescription>
                  </div>
                  {editingSlug && (
                    <Badge variant="secondary" className="flex items-center gap-1">
                      <Edit className="h-3 w-3" />
                      Editing
                    </Badge>
                  )}
                </div>
              </CardHeader>

              <CardContent className="p-6 space-y-6">
                <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                  {/* LEFT SIDE - Basic Info */}
                  <div className="xl:col-span-2 space-y-6">
                    {/* Title & Slug */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="title" className="text-sm font-semibold text-slate-700 flex items-center gap-1">
                          Title <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="title"
                          placeholder="Enter post title"
                          value={form.title ?? ""}
                          onChange={(e) => setForm({ ...form, title: e.target.value })}
                          className="focus:ring-2 focus:ring-blue-500 border-slate-300"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="slug" className="text-sm font-semibold text-slate-700 flex items-center gap-1">
                          Slug <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="slug"
                          placeholder="URL-friendly slug"
                          value={form.slug ?? ""}
                          onChange={(e) => setForm({ ...form, slug: e.target.value })}
                          className="focus:ring-2 focus:ring-blue-500 border-slate-300 font-mono text-sm"
                        />
                      </div>
                    </div>

                    {/* Date & Author */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="date" className="text-sm font-semibold text-slate-700 flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          Publish Date
                        </Label>
                        <Input
                          id="date"
                          type="date"
                          value={form.date ?? ""}
                          onChange={(e) => setForm({ ...form, date: e.target.value })}
                          className="focus:ring-2 focus:ring-blue-500 border-slate-300"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="author" className="text-sm font-semibold text-slate-700 flex items-center gap-1">
                          <User className="h-4 w-4" />
                          Author
                        </Label>
                        <Input
                          id="author"
                          placeholder="Author name"
                          value={form.author ?? ""}
                          onChange={(e) => setForm({ ...form, author: e.target.value })}
                          className="focus:ring-2 focus:ring-blue-500 border-slate-300"
                        />
                      </div>
                    </div>

                    {/* Cover Image Upload */}
                    <div className="space-y-3">
                      <Label className="text-sm font-semibold text-slate-700 flex items-center gap-1">
                        <Image className="h-4 w-4" />
                        Cover Image
                      </Label>
                      
                      <div className="flex flex-col sm:flex-row gap-3">
                        <Input
                          placeholder="https://example.com/image.jpg"
                          value={form.coverImage ?? ""}
                          onChange={(e) => setForm({ ...form, coverImage: e.target.value })}
                          className="focus:ring-2 focus:ring-blue-500 border-slate-300 flex-1"
                        />
                        <label className="flex items-center gap-2 px-4 py-2 border border-slate-300 rounded-md cursor-pointer hover:bg-slate-50 transition-colors bg-white">
                          <UploadCloud className={`h-4 w-4 ${uploading ? 'animate-pulse' : ''}`} />
                          <span className="text-sm font-medium text-slate-700">
                            {uploading ? "Uploading..." : "Upload"}
                          </span>
                          <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} disabled={uploading} />
                        </label>
                      </div>

                      {form.coverImage && (
                        <div className="mt-3">
                          <div className="relative h-48 w-full rounded-lg border-2 border-dashed border-slate-300 overflow-hidden bg-slate-100">
                            <img
                              src={form.coverImage}
                              alt="Cover preview"
                              className="h-full w-full object-cover"
                            />
                            <div className="absolute inset-0 bg-black/0 hover:bg-black/10 transition-colors flex items-center justify-center">
                              <Eye className="h-8 w-8 text-white opacity-0 hover:opacity-100 transition-opacity" />
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Categories & Tags */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="categories" className="text-sm font-semibold text-slate-700 flex items-center gap-1">
                          <Tag className="h-4 w-4" />
                          Categories
                        </Label>
                        <Input
                          id="categories"
                          placeholder="Technology, Design, Web Dev"
                          value={(form.categories ?? []).join(", ")}
                          onChange={(e) =>
                            setForm({
                              ...form,
                              categories: e.target.value.split(",").map((s) => s.trim()).filter(Boolean),
                            })
                          }
                          className="focus:ring-2 focus:ring-blue-500 border-slate-300"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="tags" className="text-sm font-semibold text-slate-700">
                          Tags
                        </Label>
                        <Input
                          id="tags"
                          placeholder="react, nextjs, tutorial"
                          value={(form.tags ?? []).join(", ")}
                          onChange={(e) =>
                            setForm({
                              ...form,
                              tags: e.target.value.split(",").map((s) => s.trim()).filter(Boolean),
                            })
                          }
                          className="focus:ring-2 focus:ring-blue-500 border-slate-300"
                        />
                      </div>
                    </div>

                    {/* Excerpt */}
                    <div className="space-y-2">
                      <Label htmlFor="excerpt" className="text-sm font-semibold text-slate-700">
                        Excerpt
                      </Label>
                      <Textarea
                        id="excerpt"
                        placeholder="Brief summary of the post (appears in blog listings and SEO)"
                        value={form.excerpt ?? ""}
                        onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
                        rows={3}
                        className="focus:ring-2 focus:ring-blue-500 border-slate-300 resize-none"
                      />
                    </div>

                    {/* Content Editor */}
                    <div className="space-y-2">
                      <Label htmlFor="content" className="text-sm font-semibold text-slate-700">
                        Content (Markdown)
                      </Label>
                      <div className="border border-slate-300 rounded-md overflow-hidden">
                        <MarkdownEditor 
                          value={form.content ?? ""} 
                          onChange={(v: string) => setForm({ ...form, content: v })} 
                        />
                      </div>
                    </div>
                  </div>

                  {/* RIGHT SIDE - SEO & Actions */}
                  <div className="space-y-6">
                    {/* SEO Settings Card */}
                    <Card className="border-slate-200 bg-gradient-to-br from-slate-50 to-blue-50/30">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-lg font-semibold flex items-center gap-2 text-slate-800">
                          <Settings className="h-5 w-5" />
                          SEO Settings
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="metaTitle" className="text-sm font-medium text-slate-700">
                            Meta Title
                          </Label>
                          <Input
                            id="metaTitle"
                            placeholder="SEO title for search engines"
                            value={form.metaTitle ?? ""}
                            onChange={(e) => setForm({ ...form, metaTitle: e.target.value })}
                            className="focus:ring-2 focus:ring-blue-500 border-slate-300 text-sm"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="metaDescription" className="text-sm font-medium text-slate-700">
                            Meta Description
                          </Label>
                          <Textarea
                            id="metaDescription"
                            placeholder="SEO description for search engines"
                            value={form.metaDescription ?? ""}
                            onChange={(e) => setForm({ ...form, metaDescription: e.target.value })}
                            rows={3}
                            className="focus:ring-2 focus:ring-blue-500 border-slate-300 resize-none text-sm"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="canonicalUrl" className="text-sm font-medium text-slate-700 flex items-center gap-1">
                            <Link className="h-4 w-4" />
                            Canonical URL
                          </Label>
                          <Input
                            id="canonicalUrl"
                            placeholder="https://yourdomain.com/blog/your-post"
                            value={form.canonicalUrl ?? ""}
                            onChange={(e) => setForm({ ...form, canonicalUrl: e.target.value })}
                            className="focus:ring-2 focus:ring-blue-500 border-slate-300 text-sm"
                          />
                        </div>
                        <div className="flex items-center justify-between pt-2">
                          <Label htmlFor="isIndexed" className="text-sm font-medium text-slate-700 cursor-pointer">
                            Index in Search Engines
                          </Label>
                          <Switch
                            id="isIndexed"
                            checked={Boolean(form.isIndexed)}
                            onCheckedChange={(checked) => setForm({ ...form, isIndexed: checked })}
                          />
                        </div>
                      </CardContent>
                    </Card>

                    {/* Action Buttons */}
                    <Card className="border-slate-200">
                      <CardContent className="p-4 space-y-3">
                        <Button 
                          onClick={handleSubmit} 
                          disabled={loading || !form.title || !form.slug} 
                          className="w-full flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
                          size="lg"
                        >
                          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                          {editingSlug ? "Update Post" : "Create Post"}
                        </Button>
                        {editingSlug && (
                          <Button 
                            variant="outline" 
                            onClick={resetForm} 
                            disabled={loading} 
                            className="w-full flex items-center gap-2"
                          >
                            <X className="h-4 w-4" />
                            Cancel Edit
                          </Button>
                        )}
                      </CardContent>
                    </Card>

                    {/* Form Status */}
                    <Card className="border-slate-200">
                      <CardContent className="p-4 space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-slate-600">Title:</span>
                          <Badge variant={form.title ? "default" : "secondary"} className="text-xs">
                            {form.title ? "✓ Set" : "Required"}
                          </Badge>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-600">Slug:</span>
                          <Badge variant={form.slug ? "default" : "secondary"} className="text-xs">
                            {form.slug ? "✓ Set" : "Required"}
                          </Badge>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-600">Content:</span>
                          <Badge variant={form.content ? "default" : "secondary"} className="text-xs">
                            {form.content ? `${form.content.length} chars` : "Empty"}
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ✅ Posts List */}
          <TabsContent value="posts">
            <Card className="border-slate-200 shadow-lg">
              <CardHeader className="pb-4 bg-gradient-to-r from-slate-50 to-blue-50/50 border-b">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <CardTitle className="text-2xl font-bold text-slate-900">Blog Posts</CardTitle>
                    <CardDescription className="text-slate-600">
                      Manage your existing blog posts ({filteredPosts.length} of {posts.length})
                    </CardDescription>
                  </div>
                  <div className="relative w-full sm:w-64">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                    <Input
                      placeholder="Search posts..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 focus:ring-2 focus:ring-blue-500 border-slate-300"
                    />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                {loading ? (
                  <div className="flex flex-col items-center justify-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-slate-400 mb-4" />
                    <p className="text-slate-500">Loading posts...</p>
                  </div>
                ) : filteredPosts.length === 0 ? (
                  <div className="text-center py-12">
                    <FileText className="h-16 w-16 mx-auto mb-4 text-slate-300" />
                    <h3 className="text-lg font-semibold text-slate-600 mb-2">
                      {searchQuery ? "No matching posts found" : "No blog posts yet"}
                    </h3>
                    <p className="text-slate-500 mb-4">
                      {searchQuery ? "Try adjusting your search terms" : "Create your first blog post to get started"}
                    </p>
                    {!searchQuery && (
                      <Button onClick={() => setActiveTab("edit")} className="flex items-center gap-2">
                        <Plus className="h-4 w-4" />
                        Create First Post
                      </Button>
                    )}
                  </div>
                ) : (
                  <div className="divide-y divide-slate-200">
                    {filteredPosts.map((post) => (
                      <div
                        key={post.slug}
                        className="p-6 hover:bg-slate-50/50 transition-colors group"
                      >
                        <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                          {/* Post Image & Info */}
                          <div className="flex items-start gap-4 flex-1 min-w-0">
                            {post.coverImage ? (
                              <div className="flex-shrink-0">
                                <img
                                  src={post.coverImage}
                                  alt=""
                                  className="h-16 w-16 rounded-lg object-cover border shadow-sm"
                                />
                              </div>
                            ) : (
                              <div className="flex-shrink-0 h-16 w-16 rounded-lg bg-slate-200 border flex items-center justify-center">
                                <Image className="h-6 w-6 text-slate-400" />
                              </div>
                            )}
                            <div className="flex-1 min-w-0">
                              <h3 className="font-semibold text-slate-900 truncate group-hover:text-blue-600 transition-colors">
                                {post.title}
                              </h3>
                              <p className="text-sm text-slate-600 mt-1 line-clamp-2">
                                {post.excerpt || "No excerpt provided"}
                              </p>
                              <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-slate-500">
                                <span className="flex items-center gap-1">
                                  <Calendar className="h-3 w-3" />
                                  {new Date(post.date).toLocaleDateString()}
                                </span>
                                {post.author && (
                                  <span className="flex items-center gap-1">
                                    <User className="h-3 w-3" />
                                    {post.author}
                                  </span>
                                )}
                                {post.categories && post.categories.length > 0 && (
                                  <span className="flex items-center gap-1">
                                    <Tag className="h-3 w-3" />
                                    {post.categories.slice(0, 2).join(", ")}
                                    {post.categories.length > 2 && ` +${post.categories.length - 2}`}
                                  </span>
                                )}
                                {!post.isIndexed && (
                                  <Badge variant="outline" className="text-xs bg-amber-50 text-amber-700 border-amber-200">
                                    No Index
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Actions */}
                          <div className="flex items-center gap-2 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => startEdit(post)}
                              disabled={loading}
                              className="flex items-center gap-1 border-slate-300"
                            >
                              <Edit className="h-3 w-3" />
                              Edit
                            </Button>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button size="sm" variant="ghost" className="h-9 w-9 p-0">
                                  <MoreVertical className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => startEdit(post)}>
                                  <Edit className="h-4 w-4 mr-2" />
                                  Edit Post
                                </DropdownMenuItem>
                                <DropdownMenuItem 
                                  onClick={() => handleDelete(post.slug)}
                                  className="text-red-600 focus:text-red-600"
                                >
                                  <Trash2 className="h-4 w-4 mr-2" />
                                  Delete Post
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}