# 🔐 Role-Based Access Control

## User Roles

### 1. **User** (Regular User)
**Purpose**: Browse and search for properties

**Access**:
- ✅ Browse all properties
- ✅ Search and filter properties
- ✅ View property details
- ✅ Contact agents
- ✅ Save favorites (future feature)
- ✅ Account settings

**Restrictions**:
- ❌ Cannot access admin dashboard
- ❌ Cannot post properties
- ❌ Cannot view "My Listings"
- ❌ Cannot access agent features

**Sign Up**: `/signup/user`

---

### 2. **Agent**
**Purpose**: List and manage properties

**Access**:
- ✅ All User features
- ✅ Admin dashboard
- ✅ Post properties
- ✅ My Listings
- ✅ Edit/Delete own properties
- ✅ View leads
- ✅ Manage profile
- ✅ Agent-specific settings

**Restrictions**:
- ❌ Cannot access admin-only features
- ❌ Cannot manage other agents' properties

**Sign Up**: `/signup/agent`

---

### 3. **Admin** (Future)
**Purpose**: Platform management

**Access**:
- ✅ All Agent features
- ✅ Manage all properties
- ✅ Manage users
- ✅ View analytics
- ✅ Moderate content
- ✅ System settings

**Note**: Admin accounts created manually in database

---

## Access Control Implementation

### Protected Routes

**Admin Dashboard** (`/admin/*`)
- Requires: `role === 'agent'` OR `role === 'admin'`
- Redirect: `/` (homepage) if user role

**Post Property** (`/admin/properties/new`)
- Requires: `role === 'agent'` OR `role === 'admin'`
- Redirect: `/login` if not authenticated

**My Listings** (`/admin/properties`)
- Requires: `role === 'agent'` OR `role === 'admin'`
- Shows: Only user's own properties

---

## UI Elements by Role

### Header Navigation

**All Users (Not Logged In)**:
- Sign In dropdown (User/Agent options)

**Regular Users (Logged In)**:
- User avatar
- Settings
- Logout
- ❌ No "List Property" button
- ❌ No Dashboard link

**Agents (Logged In)**:
- User avatar
- Dashboard link
- Profile link
- Settings
- Logout
- ✅ "List Property" button

**Admins (Logged In)**:
- Same as Agents
- Plus admin-specific features

---

## How It Works

### 1. Sign Up
```typescript
// User signup
role: 'user'

// Agent signup
role: 'agent'
```

### 2. Authentication Check
```typescript
// In protected pages
if (!user || (user.role !== 'agent' && user.role !== 'admin')) {
  redirect('/');
}
```

### 3. UI Conditional Rendering
```typescript
// Show only for agents/admins
{(user.role === 'agent' || user.role === 'admin') && (
  <Link href="/admin/dashboard">Dashboard</Link>
)}
```

---

## User Experience

### Regular User Journey:
1. Sign up as User
2. Browse properties
3. Search and filter
4. Contact agents
5. Manage account settings

### Agent Journey:
1. Sign up as Agent
2. Access dashboard
3. Post properties
4. Manage listings
5. View leads
6. Update profile

---

## Security Features

### Database Level (RLS)
```sql
-- Users can only modify their own properties
CREATE POLICY "Agents can update own properties" 
ON properties FOR UPDATE 
USING (auth.uid()::text = "landlordId");
```

### Application Level
- Route guards in layouts
- Conditional UI rendering
- Role checks before actions

### API Level
- User ID verification
- Role validation
- Owner verification for updates

---

## Testing Role Access

### Test as User:
1. Sign up at `/signup/user`
2. Try to access `/admin/dashboard` → Redirected to `/`
3. Check header → No "List Property" button
4. Check dropdown → No Dashboard link

### Test as Agent:
1. Sign up at `/signup/agent`
2. Access `/admin/dashboard` → Success
3. Check header → "List Property" button visible
4. Check dropdown → Dashboard link visible
5. Post a property → Success

---

## Benefits

### For Users:
- ✅ Clean, focused interface
- ✅ No confusing agent features
- ✅ Simple property browsing

### For Agents:
- ✅ Full property management
- ✅ Professional dashboard
- ✅ Lead management tools

### For Platform:
- ✅ Clear role separation
- ✅ Secure access control
- ✅ Scalable architecture

---

## Future Enhancements

### Planned Features:
- [ ] User favorites/saved properties
- [ ] User property requests
- [ ] Agent verification badges
- [ ] Admin moderation panel
- [ ] Role upgrade requests
- [ ] Team management for agencies

---

## Summary

**3 Roles**:
- User (browse only)
- Agent (browse + manage)
- Admin (full access)

**Access Control**:
- Route-level protection
- UI conditional rendering
- Database RLS policies

**User Experience**:
- Role-appropriate features
- Clean interfaces
- No feature clutter

**Security**:
- Multi-layer protection
- Owner verification
- Role validation

---

**All users get the features they need, nothing more, nothing less!** 🎯
