const managementDashboard = (users, userRole) => `
  <div class="container">
    <div class="dashboard-header">
      <h1 class="section-title">User Management Dashboard</h1>
      ${userRole === 'admin' ? `
        <a href="/management/users/new" class="btn btn-primary">
          <i data-lucide="user-plus"></i>
          Create New User
        </a>
      ` : ''}
    </div>

    <div class="dashboard-stats">
      <div class="card stat-card">
        <i data-lucide="users"></i>
        <div class="stat-info">
          <h3>${users.length}</h3>
          <p>Total Users</p>
        </div>
      </div>
      <div class="card stat-card">
        <i data-lucide="user"></i>
        <div class="stat-info">
          <h3>${users.filter(u => u.role === 'member').length}</h3>
          <p>Members</p>
        </div>
      </div>
      <div class="card stat-card">
        <i data-lucide="trophy"></i>
        <div class="stat-info">
          <h3>${users.filter(u => u.role === 'coach').length}</h3>
          <p>Coaches</p>
        </div>
      </div>
      <div class="card stat-card">
        <i data-lucide="shield"></i>
        <div class="stat-info">
          <h3>${users.filter(u => u.role === 'admin').length}</h3>
          <p>Admins</p>
        </div>
      </div>
    </div>

    <div class="card users-table-container">
      <div class="table-header">
        <h2>All Users</h2>
        <div class="search-filter">
          <input type="text" id="searchUsers" placeholder="Search users..." />
          <select id="roleFilter">
            <option value="">All Roles</option>
            <option value="member">Members</option>
            <option value="coach">Coaches</option>
            <option value="admin">Admins</option>
          </select>
        </div>
      </div>

      <table class="schedule-table users-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Role</th>
            <th>Joined</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody id="usersTableBody">
          ${users.map(u => `
            <tr data-role="${u.role}">
              <td>${u.full_name}</td>
              <td>${u.email}</td>
              <td>${u.phone || 'N/A'}</td>
              <td>
                <span class="role-badge role-${u.role}">${u.role}</span>
              </td>
              <td>${new Date(u.created_at).toLocaleDateString()}</td>
              <td class="actions">
                <a href="/management/users/${u.id}" class="btn-icon" title="View Details">
                  <i data-lucide="eye"></i>
                </a>
                ${userRole === 'admin' ? `
                  <a href="/management/users/${u.id}/edit" class="btn-icon" title="Edit User">
                    <i data-lucide="edit"></i>
                  </a>
                  <button onclick="confirmDelete('${u.id}', '${u.full_name}')" class="btn-icon btn-danger" title="Delete User">
                    <i data-lucide="trash-2"></i>
                  </button>
                ` : ''}
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  </div>

  <style>
    .dashboard-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 3rem;
      flex-wrap: wrap;
      gap: 1.5rem;
    }

    .dashboard-stats {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1.5rem;
      margin-bottom: 3rem;
    }

    .stat-card {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 2rem;
    }

    .stat-card i {
      width: 48px;
      height: 48px;
      color: var(--color-primary);
      flex-shrink: 0;
    }

    .stat-info h3 {
      font-size: 2.5rem;
      margin: 0;
      color: var(--color-white);
      font-family: var(--font-display);
      font-weight: 700;
    }

    .stat-info p {
      margin: 0;
      color: var(--color-gray-light);
      font-size: 0.9rem;
    }

    .users-table-container {
      padding: 2rem;
    }

    .table-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
      flex-wrap: wrap;
      gap: 1rem;
    }

    .table-header h2 {
      color: var(--color-white);
      font-family: var(--font-display);
      margin: 0;
    }

    .search-filter {
      display: flex;
      gap: 1rem;
      flex-wrap: wrap;
    }

    .search-filter input,
    .search-filter select {
      padding: 0.75rem 1rem;
      min-width: 200px;
    }

    .users-table {
      margin: 0;
    }

    .users-table tbody tr {
      cursor: pointer;
    }

    .role-badge {
      display: inline-block;
      padding: 0.375rem 0.875rem;
      border-radius: var(--border-radius-sm);
      font-size: 0.75rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .role-member {
      background: rgba(59, 130, 246, 0.2);
      color: #60a5fa;
      border: 1px solid rgba(59, 130, 246, 0.3);
    }

    .role-coach {
      background: rgba(251, 191, 36, 0.2);
      color: #fbbf24;
      border: 1px solid rgba(251, 191, 36, 0.3);
    }

    .role-admin {
      background: rgba(220, 20, 60, 0.2);
      color: var(--color-primary-light);
      border: 1px solid rgba(220, 20, 60, 0.3);
    }

    .actions {
      display: flex;
      gap: 0.5rem;
      align-items: center;
    }

    .btn-icon {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 36px;
      height: 36px;
      border: 1px solid var(--color-gray-dark);
      background: var(--color-black-lighter);
      border-radius: var(--border-radius-sm);
      cursor: pointer;
      transition: all var(--transition-fast);
      color: var(--color-gray-light);
      text-decoration: none;
      padding: 0;
    }

    .btn-icon:hover {
      background: var(--color-gray-dark);
      border-color: var(--color-primary);
      color: var(--color-primary);
      transform: translateY(-2px);
    }

    .btn-icon.btn-danger:hover {
      background: rgba(220, 20, 60, 0.2);
      border-color: var(--color-primary);
      color: var(--color-primary-light);
    }

    .btn-icon i {
      width: 18px;
      height: 18px;
    }

    @media (max-width: 768px) {
      .dashboard-header {
        flex-direction: column;
        align-items: stretch;
      }

      .search-filter {
        flex-direction: column;
      }

      .search-filter input,
      .search-filter select {
        width: 100%;
      }

      .users-table {
        font-size: 0.875rem;
      }

      .users-table th,
      .users-table td {
        padding: 0.75rem 0.5rem;
      }
    }
  </style>

  <script>
    document.getElementById('searchUsers').addEventListener('input', filterUsers);
    document.getElementById('roleFilter').addEventListener('change', filterUsers);

    function filterUsers() {
      const searchTerm = document.getElementById('searchUsers').value.toLowerCase();
      const roleFilter = document.getElementById('roleFilter').value;
      const rows = document.querySelectorAll('#usersTableBody tr');

      rows.forEach(row => {
        const text = row.textContent.toLowerCase();
        const role = row.getAttribute('data-role');
        const matchesSearch = text.includes(searchTerm);
        const matchesRole = !roleFilter || role === roleFilter;

        row.style.display = matchesSearch && matchesRole ? '' : 'none';
      });
    }

    function confirmDelete(userId, userName) {
      if (confirm(\`Are you sure you want to delete \${userName}? This action cannot be undone.\`)) {
        const form = document.createElement('form');
        form.method = 'POST';
        form.action = \`/management/users/\${userId}/delete\`;
        document.body.appendChild(form);
        form.submit();
      }
    }
  </script>
`;

export default managementDashboard;