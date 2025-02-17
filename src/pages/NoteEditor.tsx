import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useStore } from '../lib/store';
import { supabase } from '../lib/supabase';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Save, Eye, Edit as EditIcon, Plus, X } from 'lucide-react';

export default function NoteEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useStore();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState('');
  const [isPublic, setIsPublic] = useState(false);
  const [preview, setPreview] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (id) {
      fetchNote();
    }
  }, [id]);

  const fetchNote = async () => {
    try {
      const { data, error } = await supabase
        .from('notes')
        .select(`
          *,
          note_tags (
            tags (
              id,
              name
            )
          )
        `)
        .eq('id', id)
        .single();

      if (error) throw error;

      setTitle(data.title);
      setContent(data.content);
      setIsPublic(data.is_public);
      setTags(data.note_tags.map((nt: any) => nt.tags.name));
    } catch (error) {
      console.error('Error fetching note:', error);
      navigate('/');
    }
  };

  const handleSave = async () => {
    if (!title.trim()) {
      setError('Title is required');
      return;
    }

    setLoading(true);
    setError('');

    try {
      if (id) {
        // Update existing note
        const { error } = await supabase
          .from('notes')
          .update({
            title,
            content,
            is_public: isPublic,
            updated_at: new Date().toISOString(),
          })
          .eq('id', id);

        if (error) throw error;
      } else {
        // Create new note
        const { data, error } = await supabase
          .from('notes')
          .insert([
            {
              title,
              content,
              is_public: isPublic,
              user_id: user?.id,
            },
          ])
          .select()
          .single();

        if (error) throw error;

        // Handle tags
        if (tags.length > 0) {
          // First, ensure all tags exist
          const { data: existingTags, error: tagError } = await supabase
            .from('tags')
            .select('id, name')
            .in('name', tags);

          if (tagError) throw tagError;

          const existingTagNames = existingTags.map(t => t.name);
          const newTags = tags.filter(t => !existingTagNames.includes(t));

          // Create new tags
          if (newTags.length > 0) {
            const { error: newTagError } = await supabase
              .from('tags')
              .insert(newTags.map(name => ({
                name,
                user_id: user?.id,
              })));

            if (newTagError) throw newTagError;
          }

          // Get all tag IDs
          const { data: allTags, error: allTagsError } = await supabase
            .from('tags')
            .select('id, name')
            .in('name', tags);

          if (allTagsError) throw allTagsError;

          // Create note_tags associations
          const { error: noteTagsError } = await supabase
            .from('note_tags')
            .insert(allTags.map(tag => ({
              note_id: data.id,
              tag_id: tag.id,
            })));

          if (noteTagsError) throw noteTagsError;
        }

        navigate(`/notes/${data.id}`);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <div className="mb-6">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Note title"
            className="w-full px-4 py-2 text-xl font-bold border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
          />
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <div className="mb-4">
          <div className="flex items-center space-x-4 mb-2">
            <button
              onClick={() => setPreview(!preview)}
              className="flex items-center space-x-1 px-3 py-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              {preview ? (
                <>
                  <EditIcon size={18} />
                  <span>Edit</span>
                </>
              ) : (
                <>
                  <Eye size={18} />
                  <span>Preview</span>
                </>
              )}
            </button>

            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={isPublic}
                onChange={(e) => setIsPublic(e.target.checked)}
                className="rounded"
              />
              <span className="text-sm text-gray-600 dark:text-gray-400">Make public</span>
            </label>
          </div>

          {preview ? (
            <div className="prose dark:prose-invert max-w-none min-h-[300px] p-4 border rounded-lg dark:bg-gray-700">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {content}
              </ReactMarkdown>
            </div>
          ) : (
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write your note in Markdown..."
              className="w-full h-[300px] px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            />
          )}
        </div>

        <div className="mb-6">
          <div className="flex items-center space-x-2 mb-2">
            <input
              type="text"
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
              placeholder="Add a tag"
              className="px-3 py-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            />
            <button
              onClick={handleAddTag}
              className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <Plus size={20} />
            </button>
          </div>

          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <span
                key={tag}
                className="flex items-center space-x-1 px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-sm"
              >
                <span>{tag}</span>
                <button
                  onClick={() => handleRemoveTag(tag)}
                  className="hover:text-red-500"
                >
                  <X size={14} />
                </button>
              </span>
            ))}
          </div>
        </div>

        <div className="flex justify-end space-x-4">
          <button
            onClick={() => navigate('/')}
            className="px-4 py-2 border rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={loading}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
          >
            <Save size={18} />
            <span>{loading ? 'Saving...' : 'Save'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}