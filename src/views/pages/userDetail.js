const userDetailPage = (user, qrCode, currentUserRole) => `
  <div class="container">
    <div class="detail-header">
      <a href="/management/dashboard" class="back-link">
        <i data-lucide="arrow-left"></i>
        Back to Dashboard
      </a>
      <div class="header-actions">
        <h1 class="section-title">${user.full_name}</h1>
        ${currentUserRole === 'admin' ? `
          <div class="action-buttons">
            <a href="/management/users/${user.id}/edit" class="btn btn-secondary">
              <i data-lucide="edit"></i>
              Edit User
            </a>
            <button onclick="confirmDelete('${user.id}', '${user.full_name}')" class="btn btn-danger">
              <i data-lucide="trash-2"></i>
              Delete User
            </button>
          </div>
        ` : ''}
      </div>
    </div>

    <div class="detail-grid">
      <div class="card info-card">
        <div class="card-header">
          <h2>
            <i data-lucide="user"></i>
            Personal Information
          </h2>
          <span class="role-badge role-${user.role}">${user.role}</span>
        </div>
        
        <div class="info-grid">
          <div class="info-item">
            <span class="info-label">Full Name</span>
            <span class="info-value">${user.full_name}</span>
          </div>
          
          <div class="info-item">
            <span class="info-label">Email</span>
            <span class="info-value">${user.email}</span>
          </div>
          
          <div class="info-item">
            <span class="info-label">Phone</span>
            <span class="info-value">${user.phone || 'Not provided'}</span>
          </div>
          
          <div class="info-item">
            <span class="info-label">Emergency Contact</span>
            <span class="info-value">${user.emergency_contact_number || 'Not provided'}</span>
          </div>
          
          <div class="info-item">
            <span class="info-label">Member Since</span>
            <span class="info-value">${new Date(user.created_at).toLocaleDateString('en-US', { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}</span>
          </div>
          
          <div class="info-item">
            <span class="info-label">User ID</span>
            <span class="info-value user-id">${user.id}</span>
          </div>
        </div>
      </div>

      <div class="card qr-card">
        <div class="card-header">
          <h2>
            <i data-lucide="qr-code"></i>
            Member QR Code
          </h2>
        </div>
        
        <div class="qr-display">
          ${qrCode}
          <p class="qr-hint">Scan this code for gym check-in</p>
          <button onclick="downloadQR('${user.full_name}')" class="btn btn-secondary btn-small">
            <i data-lucide="download"></i>
            Download QR Code
          </button>
        </div>
      </div>
    </div>

    ${currentUserRole === 'admin' ? `
      <div class="card role-management">
        <div class="card-header">
          <h2>
            <i data-lucide="shield"></i>
            Role Management
          </h2>
        </div>
        
        <form method="POST" action="/management/users/${user.id}/role" class="role-form">
          <div class="role-options">
            <label class="role-option ${user.role === 'member' ? 'selected' : ''}">
              <input type="radio" name="role" value="member" ${user.role === 'member' ? 'checked' : ''} />
              <div class="role-content">
                <div class="role-icon">
                  <i data-lucide="user"></i>
                </div>
                <div class="role-info">
                  <strong>Member</strong>
                  <span>Regular gym access with personal QR code</span>
                </div>
              </div>
            </label>

            <label class="role-option ${user.role === 'coach' ? 'selected' : ''}">
              <input type="radio" name="role" value="coach" ${user.role === 'coach' ? 'checked' : ''} />
              <div class="role-content">
                <div class="role-icon">
                  <i data-lucide="trophy"></i>
                </div>
                <div class="role-info">
                  <strong>Coach</strong>
                  <span>Can view member information and check-ins</span>
                </div>
              </div>
            </label>

            <label class="role-option ${user.role === 'admin' ? 'selected' : ''}">
              <input type="radio" name="role" value="admin" ${user.role === 'admin' ? 'checked' : ''} />
              <div class="role-content">
                <div class="role-icon">
                  <i data-lucide="shield"></i>
                </div>
                <div class="role-info">
                  <strong>Admin</strong>
                  <span>Full system access and user management</span>
                </div>
              </div>
            </label>
          </div>

          <button type="submit" class="btn btn-primary">
            <i data-lucide="save"></i>
            Update Role
          </button>
        </form>
      </div>
    ` : ''}
  </div>

  <style>
    .detail-header {
      margin-bottom: 3rem;
    }

    .back-link {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      color: var(--color-primary);
      text-decoration: none;
      font-size: 0.9rem;
      margin-bottom: 1.5rem;
      font-weight: 600;
      transition: all var(--transition-fast);
    }

    .back-link:hover {
      color: var(--color-primary-light);
      gap: 0.75rem;
    }

    .back-link i {
      width: 18px;
      height: 18px;
    }

    .header-actions {
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 1.5rem;
    }

    .header-actions h1 {
      margin: 0;
    }

    .action-buttons {
      display: flex;
      gap: 1rem;
      flex-wrap: wrap;
    }

    .action-buttons .btn {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
    }

    .action-buttons .btn i {
      width: 18px;
      height: 18px;
    }

    .btn-danger {
      background: linear-gradient(135deg, rgba(220, 20, 60, 0.2) 0%, rgba(176, 16, 48, 0.2) 100%);
      color: var(--color-primary-light);
      border: 2px solid var(--color-primary);
    }

    .btn-danger:hover {
      background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-dark) 100%);
      color: var(--color-white);
    }

    .detail-grid {
      display: grid;
      grid-template-columns: 2fr 1fr;
      gap: 2rem;
      margin-bottom: 2rem;
    }

    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
      padding-bottom: 1rem;
      border-bottom: 1px solid var(--color-gray-dark);
    }

    .card-header h2 {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      font-size: 1.5rem;
      color: var(--color-white);
      margin: 0;
      font-family: var(--font-display);
    }

    .card-header h2 i {
      width: 24px;
      height: 24px;
      color: var(--color-primary);
    }

    .role-badge {
      display: inline-block;
      padding: 0.5rem 1rem;
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

    .info-grid {
      display: grid;
      gap: 1.5rem;
    }

    .info-item {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .info-label {
      font-size: 0.85rem;
      color: var(--color-gray-light);
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .info-value {
      font-size: 1.1rem;
      color: var(--color-white);
    }

    .user-id {
      font-family: monospace;
      font-size: 0.9rem;
      color: var(--color-gray-light);
      word-break: break-all;
    }

    .qr-display {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 1.5rem;
    }

    .qr-display svg {
      width: 240px;
      height: 240px;
      border: 2px solid var(--color-gray-dark);
      border-radius: var(--border-radius-md);
      padding: 1rem;
      background: var(--color-white);
    }

    .qr-hint {
      color: var(--color-gray-light);
      font-size: 0.9rem;
      margin: 0;
    }

    .btn-small {
      padding: 0.75rem 1.5rem;
      font-size: 0.9rem;
    }

    .role-management {
      grid-column: 1 / -1;
    }

    .role-form {
      display: flex;
      flex-direction: column;
      gap: 2rem;
    }

    .role-options {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 1.5rem;
    }

    .role-option {
      position: relative;
      cursor: pointer;
    }

    .role-option input[type="radio"] {
      position: absolute;
      opacity: 0;
    }

    .role-content {
      display: flex;
      align-items: center;
      gap: 1.5rem;
      padding: 1.5rem;
      border: 2px solid var(--color-gray-dark);
      border-radius: var(--border-radius-md);
      background: var(--color-black-lighter);
      transition: all var(--transition-base);
    }

    .role-option:hover .role-content {
      border-color: var(--color-primary);
      background: var(--color-black-light);
      transform: translateY(-2px);
    }

    .role-option.selected .role-content,
    .role-option input[type="radio"]:checked + .role-content {
      border-color: var(--color-primary);
      background: rgba(220, 20, 60, 0.1);
      box-shadow: var(--shadow-red);
    }

    .role-icon {
      width: 56px;
      height: 56px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: rgba(220, 20, 60, 0.2);
      border-radius: var(--border-radius-md);
      flex-shrink: 0;
    }

    .role-icon i {
      width: 28px;
      height: 28px;
      color: var(--color-primary);
    }

    .role-info {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .role-info strong {
      color: var(--color-white);
      font-size: 1.1rem;
      font-family: var(--font-display);
    }

    .role-info span {
      font-size: 0.9rem;
      color: var(--color-gray-light);
      line-height: 1.5;
    }

    @media (max-width: 968px) {
      .detail-grid {
        grid-template-columns: 1fr;
      }

      .role-options {
        grid-template-columns: 1fr;
      }

      .header-actions {
        flex-direction: column;
        align-items: stretch;
      }

      .action-buttons {
        width: 100%;
      }

      .action-buttons .btn {
        flex: 1;
        justify-content: center;
      }
    }
  </style>

  <script>
    function confirmDelete(userId, userName) {
      if (confirm(\`Are you sure you want to delete \${userName}? This action cannot be undone.\`)) {
        const form = document.createElement('form');
        form.method = 'POST';
        form.action = \`/management/users/\${userId}/delete\`;
        document.body.appendChild(form);
        form.submit();
      }
    }

    function downloadQR(userName) {
      const svg = document.querySelector('.qr-display svg');
      const serializer = new XMLSerializer();
      const svgString = serializer.serializeToString(svg);
      const blob = new Blob([svgString], { type: 'image/svg+xml' });
      const url = URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = \`\${userName.replace(/\\s+/g, '_')}_QR_Code.svg\`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }

    document.querySelectorAll('.role-option input[type="radio"]').forEach(radio => {
      radio.addEventListener('change', function() {
        document.querySelectorAll('.role-option').forEach(opt => opt.classList.remove('selected'));
        if (this.checked) {
          this.closest('.role-option').classList.add('selected');
        }
      });
    });
  </script>
`;

export default userDetailPage;