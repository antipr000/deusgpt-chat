import { redirect } from 'next/navigation'

const AdminPage = () => {
  redirect('/admin/models');
}

export default AdminPage