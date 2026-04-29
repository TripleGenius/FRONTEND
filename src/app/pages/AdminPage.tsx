import { useEffect, useState } from 'react';
import { Eye, EyeOff, Pencil, Trash2, X } from 'lucide-react';
import { usersApi } from '../../lib/api';
import { User } from '../../lib/types';
import { useAuth } from '../contexts/AuthContext';

interface UserForm {
  name: string;
  email: string;
  password: string;
  role: 'USER' | 'ADMIN';
}

const EMPTY_FORM: UserForm = { name: '', email: '', password: '', role: 'USER' };

export function AdminPage() {
  const { user: me } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [visiblePasswords, setVisiblePasswords] = useState<Record<string, boolean>>({});

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [createForm, setCreateForm] = useState<UserForm>(EMPTY_FORM);
  const [createError, setCreateError] = useState('');
  const [createLoading, setCreateLoading] = useState(false);

  const [editUser, setEditUser] = useState<User | null>(null);
  const [editForm, setEditForm] = useState<Partial<UserForm>>({});
  const [editError, setEditError] = useState('');
  const [editLoading, setEditLoading] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState<User | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const loadUsers = async () => {
    try {
      const data = await usersApi.getAll();
      setUsers(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadUsers(); }, []);

  const togglePassword = (id: string) =>
    setVisiblePasswords((prev) => ({ ...prev, [id]: !prev[id] }));

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreateError('');
    setCreateLoading(true);
    try {
      await usersApi.create(createForm);
      setCreateForm(EMPTY_FORM);
      setShowCreateForm(false);
      await loadUsers();
    } catch (err: any) {
      setCreateError(err.response?.data?.message || 'Алдаа гарлаа');
    } finally {
      setCreateLoading(false);
    }
  };

  const openEdit = (u: User) => {
    setEditUser(u);
    setEditForm({ name: u.name || '', email: u.email, role: u.role, password: '' });
    setEditError('');
  };

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editUser) return;
    setEditError('');
    setEditLoading(true);
    try {
      const payload: any = {
        name: editForm.name,
        email: editForm.email,
        role: editForm.role,
      };
      if (editForm.password) payload.password = editForm.password;
      await usersApi.update(editUser.id, payload);
      setEditUser(null);
      await loadUsers();
    } catch (err: any) {
      setEditError(err.response?.data?.message || 'Алдаа гарлаа');
    } finally {
      setEditLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleteLoading(true);
    try {
      await usersApi.delete(deleteTarget.id);
      setDeleteTarget(null);
      await loadUsers();
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Хэрэглэгчид</h1>
          <p className="text-muted-foreground text-sm mt-1">Нийт {users.length} хэрэглэгч</p>
        </div>
        <button
          onClick={() => { setShowCreateForm(true); setCreateError(''); }}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-xl text-sm font-medium hover:opacity-90 transition-opacity"
        >
          + Хэрэглэгч нэмэх
        </button>
      </div>

      {/* Create modal */}
      {showCreateForm && (
        <Modal title="Шинэ хэрэглэгч нэмэх" onClose={() => { setShowCreateForm(false); setCreateForm(EMPTY_FORM); }}>
          <form onSubmit={handleCreate} className="space-y-4">
            <Field label="Нэр">
              <Input value={createForm.name} onChange={(v) => setCreateForm({ ...createForm, name: v })} placeholder="Овог нэр" />
            </Field>
            <Field label="И-мэйл *">
              <Input type="email" required value={createForm.email} onChange={(v) => setCreateForm({ ...createForm, email: v })} placeholder="example@email.com" />
            </Field>
            <Field label="Нууц үг *">
              <Input type="password" required minLength={6} value={createForm.password} onChange={(v) => setCreateForm({ ...createForm, password: v })} placeholder="Хамгийн багадаа 6 тэмдэгт" />
            </Field>
            <Field label="Эрх">
              <RoleSelect value={createForm.role} onChange={(v) => setCreateForm({ ...createForm, role: v })} />
            </Field>
            {createError && <p className="text-destructive text-sm">{createError}</p>}
            <ModalButtons
              onCancel={() => { setShowCreateForm(false); setCreateForm(EMPTY_FORM); }}
              loading={createLoading}
              submitLabel="Нэмэх"
            />
          </form>
        </Modal>
      )}

      {/* Edit modal */}
      {editUser && (
        <Modal title={`Засах — ${editUser.email}`} onClose={() => setEditUser(null)}>
          <form onSubmit={handleEdit} className="space-y-4">
            <Field label="Нэр">
              <Input value={editForm.name || ''} onChange={(v) => setEditForm({ ...editForm, name: v })} placeholder="Овог нэр" />
            </Field>
            <Field label="И-мэйл *">
              <Input type="email" required value={editForm.email || ''} onChange={(v) => setEditForm({ ...editForm, email: v })} />
            </Field>
            <Field label="Шинэ нууц үг">
              <Input type="password" minLength={6} value={editForm.password || ''} onChange={(v) => setEditForm({ ...editForm, password: v })} placeholder="Хоосон орхивол өөрчлөгдөхгүй" />
            </Field>
            <Field label="Эрх">
              <RoleSelect value={editForm.role || 'USER'} onChange={(v) => setEditForm({ ...editForm, role: v })} />
            </Field>
            {editError && <p className="text-destructive text-sm">{editError}</p>}
            <ModalButtons onCancel={() => setEditUser(null)} loading={editLoading} submitLabel="Хадгалах" />
          </form>
        </Modal>
      )}

      {/* Delete confirm modal */}
      {deleteTarget && (
        <Modal title="Хэрэглэгч устгах" onClose={() => setDeleteTarget(null)}>
          <p className="text-muted-foreground mb-6">
            <span className="font-medium text-foreground">{deleteTarget.email}</span> хэрэглэгчийг устгах уу? Энэ үйлдлийг буцаах боломжгүй.
          </p>
          <div className="flex gap-3">
            <button
              onClick={() => setDeleteTarget(null)}
              className="flex-1 py-2.5 rounded-xl bg-muted text-foreground hover:bg-accent transition-colors text-sm"
            >
              Болих
            </button>
            <button
              onClick={handleDelete}
              disabled={deleteLoading}
              className="flex-1 py-2.5 rounded-xl bg-destructive text-destructive-foreground hover:opacity-90 transition-opacity text-sm font-medium disabled:opacity-50"
            >
              {deleteLoading ? 'Устгаж байна...' : 'Устгах'}
            </button>
          </div>
        </Modal>
      )}

      {loading ? (
        <div className="text-center py-12 text-muted-foreground">Ачааллаж байна...</div>
      ) : (
        <div className="border border-border rounded-2xl overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-muted/50">
              <tr>
                <th className="text-left px-4 py-3 text-muted-foreground font-medium">Нэр</th>
                <th className="text-left px-4 py-3 text-muted-foreground font-medium">И-мэйл</th>
                <th className="text-left px-4 py-3 text-muted-foreground font-medium">Нууц үг</th>
                <th className="text-left px-4 py-3 text-muted-foreground font-medium">Эрх</th>
                <th className="text-left px-4 py-3 text-muted-foreground font-medium">Бүртгүүлсэн</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-4 py-3 font-medium">{u.name || '—'}</td>
                  <td className="px-4 py-3 text-muted-foreground">{u.email}</td>
                  <td className="px-4 py-3">
                    {u.plainPassword ? (
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs">
                          {visiblePasswords[u.id] ? u.plainPassword : '••••••••'}
                        </span>
                        <button
                          onClick={() => togglePassword(u.id)}
                          className="text-muted-foreground hover:text-foreground transition-colors"
                        >
                          {visiblePasswords[u.id] ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    ) : (
                      <span className="text-muted-foreground text-xs">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${
                      u.role === 'ADMIN' ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'
                    }`}>
                      {u.role === 'ADMIN' ? 'Админ' : 'Хэрэглэгч'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {u.createdAt ? new Date(u.createdAt).toLocaleDateString('mn-MN') : '—'}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2 justify-end">
                      <button
                        onClick={() => openEdit(u)}
                        className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                      {u.id !== me?.id && (
                        <button
                          onClick={() => setDeleteTarget(u)}
                          className="p-1.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {users.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">
                    Хэрэглэгч байхгүй байна
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card border border-border rounded-2xl p-6 w-full max-w-md shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">{title}</h2>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-sm text-muted-foreground mb-1">{label}</label>
      {children}
    </div>
  );
}

function Input({ type = 'text', value, onChange, placeholder, required, minLength }: {
  type?: string; value: string; onChange: (v: string) => void;
  placeholder?: string; required?: boolean; minLength?: number;
}) {
  return (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      required={required}
      minLength={minLength}
      className="w-full px-3 py-2 border border-border rounded-xl bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
    />
  );
}

function RoleSelect({ value, onChange }: { value: 'USER' | 'ADMIN'; onChange: (v: 'USER' | 'ADMIN') => void }) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value as 'USER' | 'ADMIN')}
      className="w-full px-3 py-2 border border-border rounded-xl bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
    >
      <option value="USER">Хэрэглэгч</option>
      <option value="ADMIN">Админ</option>
    </select>
  );
}

function ModalButtons({ onCancel, loading, submitLabel }: { onCancel: () => void; loading: boolean; submitLabel: string }) {
  return (
    <div className="flex gap-3 pt-2">
      <button type="button" onClick={onCancel} className="flex-1 py-2.5 rounded-xl bg-muted text-foreground hover:bg-accent transition-colors text-sm">
        Болих
      </button>
      <button type="submit" disabled={loading} className="flex-1 py-2.5 rounded-xl bg-primary text-primary-foreground hover:opacity-90 transition-opacity text-sm font-medium disabled:opacity-50">
        {loading ? 'Түр хүлээнэ үү...' : submitLabel}
      </button>
    </div>
  );
}
