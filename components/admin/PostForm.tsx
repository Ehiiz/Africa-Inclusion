"use client";

import Link from "next/link";
import { useActionState, useEffect, useState } from "react";
import { createPostAction, updatePostAction, type FormState } from "@/app/admin/actions";
import { MAX_IMAGE_BYTES, imageUrl, type Post } from "@/lib/posts-shared";

function slugify(input: string): string {
  return input
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/['’]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

export default function PostForm({ post }: { post?: Post }) {
  const action = post ? updatePostAction : createPostAction;
  const [state, formAction, pending] = useActionState<FormState, FormData>(action, undefined);

  const [title, setTitle] = useState(post?.title ?? "");
  // An untouched slug tracks the title; once edited by hand it stays put.
  const [slug, setSlug] = useState(post?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(Boolean(post?.slug));

  const storedImage = post ? imageUrl(post) : null;
  const [preview, setPreview] = useState<string | null>(null);
  const [remove, setRemove] = useState(false);

  // Object URLs for the locally chosen file have to be released by hand.
  useEffect(() => () => { if (preview) URL.revokeObjectURL(preview); }, [preview]);

  const shown = remove ? null : preview ?? storedImage;

  return (
    <form className="admin-form" action={formAction}>
      {post && <input type="hidden" name="id" value={post.id} />}

      <div className="admin-form__main">
        <div className="admin-card">
          <label className="admin-field">
            <span className="admin-field__label">Title</span>
            <input
              className="admin-input admin-input--title"
              name="title"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (!slugTouched) setSlug(slugify(e.target.value));
              }}
              placeholder="Why digital account opening doesn't guarantee financial inclusion"
              required
            />
          </label>

          <label className="admin-field">
            <span className="admin-field__label">Slug</span>
            <input
              className="admin-input admin-input--mono"
              name="slug"
              value={slug}
              onChange={(e) => {
                setSlug(e.target.value);
                setSlugTouched(true);
              }}
              placeholder="auto-generated from the title"
            />
            <span className="admin-field__hint">/insights/{slug || "…"}</span>
          </label>

          <label className="admin-field">
            <span className="admin-field__label">Excerpt</span>
            <textarea
              className="admin-input admin-textarea"
              name="excerpt"
              rows={3}
              defaultValue={post?.excerpt ?? ""}
              placeholder="Shown on the landing page and the Insights index. Leave blank to use the opening paragraph."
            />
          </label>

          <label className="admin-field">
            <span className="admin-field__label">
              Body <span className="admin-field__tag">Markdown</span>
            </span>
            <textarea
              className="admin-input admin-textarea admin-textarea--body"
              name="body"
              rows={22}
              defaultValue={post?.body ?? ""}
              placeholder={"## A heading\n\nA paragraph of the argument.\n\n- a point\n- another point"}
              required
            />
          </label>
        </div>
      </div>

      <aside className="admin-form__side">
        <div className="admin-card">
          <h2 className="admin-card__title">Publishing</h2>

          <label className="admin-check">
            <input type="checkbox" name="published" defaultChecked={post?.published ?? false} />
            <span>
              <strong>Published</strong>
              <small>Visible on the site and in the Insights section.</small>
            </span>
          </label>

          <label className="admin-check">
            <input type="checkbox" name="featured" defaultChecked={post?.featured ?? false} />
            <span>
              <strong>Featured</strong>
              <small>Takes the large card. Only one post can be featured.</small>
            </span>
          </label>

          <div className="admin-field">
            <span className="admin-field__label">Preview image</span>

            {shown ? (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img className="admin-image-preview" src={shown} alt="" />
            ) : (
              <p className="admin-image-empty">
                No image. The card falls back to the default artwork.
              </p>
            )}

            <input
              className="admin-file"
              type="file"
              name="image"
              accept="image/jpeg,image/png,image/webp,image/avif"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (preview) URL.revokeObjectURL(preview);
                setPreview(file ? URL.createObjectURL(file) : null);
                if (file) setRemove(false);
              }}
            />
            <span className="admin-field__hint">
              JPEG, PNG, WebP or AVIF, up to {(MAX_IMAGE_BYTES / (1024 * 1024)).toFixed(0)} MB.
              Landscape, around 1200&times;900, reads best.
            </span>

            {storedImage && (
              <label className="admin-check admin-check--tight">
                <input
                  type="checkbox"
                  name="removeImage"
                  checked={remove}
                  onChange={(e) => setRemove(e.target.checked)}
                />
                <span>
                  <strong>Remove the current image</strong>
                </span>
              </label>
            )}
          </div>

          <label className="admin-field">
            <span className="admin-field__label">Image alt text</span>
            <input
              className="admin-input"
              name="imageAlt"
              defaultValue={post?.imageAlt ?? ""}
              placeholder="What the photograph shows, for screen readers"
            />
          </label>

          <label className="admin-field">
            <span className="admin-field__label">Category</span>
            <input
              className="admin-input"
              name="category"
              defaultValue={post?.category ?? ""}
              placeholder="Trust &amp; Behaviour"
            />
          </label>

          <label className="admin-field">
            <span className="admin-field__label">Read time (minutes)</span>
            <input
              className="admin-input"
              name="readMinutes"
              type="number"
              min={1}
              defaultValue={post?.readMinutes ?? ""}
              placeholder="auto"
            />
            <span className="admin-field__hint">Leave blank to estimate from the body.</span>
          </label>

          {state?.error && (
            <p className="admin-error" role="alert">
              {state.error}
            </p>
          )}

          <div className="admin-actions">
            <button className="btn btn--green" type="submit" disabled={pending}>
              {pending ? "Saving…" : post ? "Save changes" : "Create post"}
            </button>
            <Link className="btn btn--ghost-dark" href="/admin">
              Cancel
            </Link>
          </div>
        </div>
      </aside>
    </form>
  );
}
