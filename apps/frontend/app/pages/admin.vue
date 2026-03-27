<template>
  <div class="min-h-screen bg-[#f8fafc] text-[#0f172a]">
    <header class="flex h-[46px] items-center border-b border-slate-200 bg-white">
      <button
        type="button"
        class="inline-flex h-full items-center gap-2 border-r border-slate-200 px-4 text-[13px] font-medium text-slate-500 transition-colors duration-150 hover:bg-slate-50"
        @click="goBackToApp"
      >
        <svg viewBox="0 0 20 20" class="h-4 w-4 fill-current">
          <path d="M11.8 4.4a1 1 0 0 1 0 1.4L7.6 10l4.2 4.2a1 1 0 0 1-1.4 1.4L5.5 10.7a1 1 0 0 1 0-1.4l4.9-4.9a1 1 0 0 1 1.4 0Z"/>
        </svg>
        <span>Back to AppChat</span>
      </button>
      <div class="flex items-center gap-2 px-4 text-[13px] font-semibold text-[#111827]">
        <span class="inline-flex h-5 w-5 items-center justify-center rounded-md bg-indigo-500 text-[11px] font-semibold text-white">A</span>
        <span>{{ workspaceName }} - Admin Panel</span>
      </div>
    </header>

    <main class="mx-auto max-w-[940px] px-6 py-8">
      <h1 class="text-[38px] font-semibold leading-none text-[#111827]">Admin Panel</h1>
      <p class="mt-2 text-[14px] text-slate-500">Manage your workspace members, roles, and permissions.</p>

      <section class="mt-6 grid grid-cols-4 gap-3">
        <article v-for="card in statCards" :key="card.label" class="rounded-lg border border-slate-200 bg-white p-4">
          <p class="text-[12px] font-medium text-slate-400">{{ card.label }}</p>
          <p class="mt-1 text-[34px] font-semibold leading-none text-slate-900">{{ card.value }}</p>
          <p class="mt-2 text-[12px] text-slate-400">{{ card.meta }}</p>
        </article>
      </section>

      <nav class="mt-6 flex items-center gap-3 border-b border-slate-200 pb-0.5 text-[14px] text-slate-500">
        <button
          v-for="tab in tabs"
          :key="tab.key"
          type="button"
          class="flex items-center gap-2 border-b-2 px-3 py-2.5 font-medium transition-colors"
          :class="activeTab === tab.key ? 'border-indigo-500 text-indigo-600' : 'border-transparent hover:text-slate-700'"
          @click="activeTab = tab.key"
        >
          <span>{{ tab.label }}</span>
          <span v-if="tab.count !== undefined" class="inline-flex h-5 min-w-5 items-center justify-center rounded-md bg-slate-100 px-1 text-[12px] text-slate-500">{{ tab.count }}</span>
        </button>
      </nav>

      <section v-if="activeTab === 'members'" class="pt-4">
        <div class="flex items-center gap-2">
          <label class="relative block flex-1">
            <svg viewBox="0 0 20 20" class="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 fill-slate-300">
              <path d="M8.7 2a6.7 6.7 0 1 1 0 13.4A6.7 6.7 0 0 1 8.7 2Zm0 1.8a4.9 4.9 0 1 0 0 9.8 4.9 4.9 0 0 0 0-9.8Zm9 11.6 1.8 1.8a.9.9 0 0 1-1.3 1.3l-1.8-1.8a.9.9 0 0 1 1.3-1.3Z" />
            </svg>
            <input v-model="search" type="text" placeholder="Search members..." class="h-8 w-full rounded-md border border-slate-200 bg-white pl-9 pr-3 text-[13px] text-slate-700 outline-none placeholder:text-slate-400 focus:border-indigo-400" />
          </label>
          <button class="inline-flex h-8 items-center rounded-md bg-indigo-500 px-4 text-[13px] font-semibold text-white transition-colors hover:bg-indigo-600">+ Invite member</button>
        </div>

        <div class="mt-4 overflow-hidden rounded-lg border border-slate-200 bg-white">
          <table class="w-full border-collapse text-left">
            <thead class="bg-[#fbfcfd] text-[12px] uppercase tracking-[0.03em] text-slate-500">
              <tr>
                <th class="px-4 py-3 font-semibold">Member</th>
                <th class="px-4 py-3 font-semibold">Role</th>
                <th class="px-4 py-3 font-semibold">Status</th>
                <th class="px-4 py-3 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="member in filteredMembers" :key="member.email" class="border-t border-slate-200 text-[14px]">
                <td class="px-4 py-3">
                  <div class="flex items-center gap-3">
                    <div class="relative h-8 w-8 rounded-md" :class="member.color">
                      <span class="flex h-full w-full items-center justify-center text-[13px] font-semibold text-white">{{ member.initials }}</span>
                      <span class="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border border-white" :class="member.dotColor" />
                    </div>
                    <div>
                      <p class="font-medium text-slate-900">
                        {{ member.name }}
                        <span v-if="member.you" class="text-[12px] text-slate-400">(you)</span>
                      </p>
                      <p class="text-[12px] text-slate-400">{{ member.email }}</p>
                    </div>
                  </div>
                </td>
                <td class="px-4 py-3">
                  <select class="h-6 rounded-md border px-2 text-[13px] outline-none" :class="member.role === 'Guest' ? 'border-amber-300 bg-amber-50 text-amber-600' : 'border-slate-200 bg-slate-50 text-slate-600'">
                    <option>{{ member.role }}</option>
                    <option>Admin</option>
                    <option>Member</option>
                    <option>Guest</option>
                  </select>
                </td>
                <td class="px-4 py-3">
                  <div class="flex items-center gap-2 text-[13px] text-slate-600">
                    <span class="h-2 w-2 rounded-full" :class="member.statusDot" />
                    <span>{{ member.status }}</span>
                  </div>
                </td>
                <td class="px-4 py-3 text-[13px]">
                  <button class="text-slate-600 hover:text-slate-800">Message</button>
                  <button v-if="!member.you" class="ml-4 text-red-500 hover:text-red-600">Remove</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="mt-2 text-[12px] text-slate-400">{{ filteredMembers.length }} of {{ members.length }} members shown</p>
      </section>

      <section v-else-if="activeTab === 'roles'" class="pt-4">
        <div class="grid grid-cols-3 gap-3">
          <article v-for="role in roles" :key="role.name" class="rounded-lg border border-slate-200 bg-white p-4">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-3">
                <span class="inline-flex h-6 w-6 items-center justify-center rounded-md text-[12px] font-semibold text-white" :class="role.badgeColor">{{ role.badge }}</span>
                <p class="text-[14px] font-semibold text-slate-900">{{ role.name }}</p>
              </div>
              <p class="text-[12px] text-slate-400">{{ role.count }}</p>
            </div>
            <p class="mt-2 text-[13px] leading-6 text-slate-500">{{ role.description }}</p>
          </article>
        </div>
      </section>

      <section v-else-if="activeTab === 'permissions'" class="pt-4 space-y-4">
        <div v-for="group in permissionGroups" :key="group.title">
          <p class="inline-flex rounded-md border border-slate-200 bg-[#fbfcfd] px-2 py-1 text-[12px] font-medium text-slate-500">{{ group.title }} permissions</p>
          <div class="mt-2 overflow-hidden rounded-lg border border-slate-200 bg-white">
            <div v-for="permission in group.items" :key="permission.label" class="flex items-center justify-between border-b border-slate-200 px-4 py-3 last:border-b-0">
              <div>
                <p class="text-[14px] font-medium text-slate-900">{{ permission.label }}</p>
                <p class="text-[12px] text-slate-400">{{ permission.description }}</p>
              </div>
              <button type="button" class="relative h-6 w-9 rounded-full transition-colors" :class="permission.enabled ? 'bg-indigo-500' : 'bg-slate-200'" @click="permission.enabled = !permission.enabled">
                <span class="absolute top-1/2 h-4 w-4 -translate-y-1/2 rounded-full bg-white transition-all" :class="permission.enabled ? 'left-[18px]' : 'left-[2px]'" />
              </button>
            </div>
          </div>
        </div>
      </section>

      <section v-else class="pt-4">
        <div class="overflow-hidden rounded-lg border border-slate-200 bg-white">
          <table class="w-full border-collapse text-left">
            <thead class="bg-[#fbfcfd] text-[12px] uppercase tracking-[0.03em] text-slate-500">
              <tr>
                <th class="px-4 py-3 font-semibold">Event</th>
                <th class="px-4 py-3 font-semibold">User</th>
                <th class="px-4 py-3 font-semibold">Date</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="log in auditLogs" :key="log.title" class="border-t border-slate-200 text-[14px]">
                <td class="px-4 py-3">
                  <div class="flex items-start gap-2">
                    <span class="mt-0.5 inline-flex h-4 w-4 items-center justify-center rounded-full text-[10px] text-white" :class="log.iconColor">{{ log.icon }}</span>
                    <div>
                      <p class="text-slate-900">{{ log.title }}</p>
                      <p class="text-[12px] text-slate-400">{{ log.meta }}</p>
                    </div>
                  </div>
                </td>
                <td class="px-4 py-3">
                  <div class="flex items-center gap-2">
                    <span class="inline-flex h-5 w-5 items-center justify-center rounded-md text-[10px] font-semibold text-white" :class="log.userColor">{{ log.userInitials }}</span>
                    <span class="text-slate-700">{{ log.user }}</span>
                  </div>
                </td>
                <td class="px-4 py-3 text-slate-400">{{ log.time }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </main>
  </div>
</template>

<script setup lang="ts">
type AdminTab = 'members' | 'roles' | 'permissions' | 'audit';

const tabs: Array<{ key: AdminTab; label: string; count?: number }> = [
  { key: 'members', label: 'Members', count: 6 },
  { key: 'roles', label: 'Roles' },
  { key: 'permissions', label: 'Permissions' },
  { key: 'audit', label: 'Audit Log', count: 6 },
];

const activeTab = ref<AdminTab>('members');
const search = ref('');

const workspaceName = computed(() => {
  if (!process.client) return 'Acme Inc';
  const raw = localStorage.getItem('appchat_workspace');
  if (!raw) return 'Acme Inc';
  try {
    const parsed = JSON.parse(raw) as { name?: string };
    return parsed.name?.trim() || 'Acme Inc';
  } catch {
    return 'Acme Inc';
  }
});

const statCards = [
  { label: 'Total members', value: '47', meta: '+3 this month' },
  { label: 'Active today', value: '12', meta: '25% of team' },
  { label: 'Channels', value: '6', meta: '1 private' },
  { label: 'Messages today', value: '142', meta: '+18% vs yesterday' },
];

const members = reactive([
  { initials: 'AM', color: 'bg-indigo-500', dotColor: 'bg-emerald-500', name: 'Alex Morgan', email: 'alex.morgan@acme.io', role: 'Admin', status: 'Online', statusDot: 'bg-emerald-500', you: true },
  { initials: 'SC', color: 'bg-pink-500', dotColor: 'bg-emerald-500', name: 'Sarah Chen', email: 'sarah.chen@acme.io', role: 'Member', status: 'Online', statusDot: 'bg-emerald-500', you: false },
  { initials: 'JK', color: 'bg-amber-500', dotColor: 'bg-amber-400', name: 'Jordan Kim', email: 'jordan.kim@acme.io', role: 'Member', status: 'Away', statusDot: 'bg-amber-400', you: false },
  { initials: 'MW', color: 'bg-emerald-500', dotColor: 'bg-emerald-500', name: 'Marcus Webb', email: 'marcus.webb@acme.io', role: 'Member', status: 'Online', statusDot: 'bg-emerald-500', you: false },
  { initials: 'PP', color: 'bg-violet-500', dotColor: 'bg-red-500', name: 'Priya Patel', email: 'priya.patel@acme.io', role: 'Member', status: 'Dnd', statusDot: 'bg-red-500', you: false },
  { initials: 'TB', color: 'bg-red-500', dotColor: 'bg-slate-300', name: 'Tom Bradley', email: 'tom.bradley@contractor.com', role: 'Guest', status: 'Offline', statusDot: 'bg-slate-400', you: false },
]);

const filteredMembers = computed(() => {
  const q = search.value.trim().toLowerCase();
  if (!q) return members;
  return members.filter((m) => m.name.toLowerCase().includes(q) || m.email.toLowerCase().includes(q));
});

const roles = [
  { badge: 'A', name: 'Admin', count: '1 user', badgeColor: 'bg-indigo-500', description: 'Full access to workspace settings, member management, and all channels.' },
  { badge: 'M', name: 'Member', count: '4 users', badgeColor: 'bg-slate-500', description: 'Can send messages, create channels, and access public content.' },
  { badge: 'G', name: 'Guest', count: '1 user', badgeColor: 'bg-amber-500', description: 'Limited access - can view and reply in designated channels only.' },
];

const permissionGroups = reactive([
  {
    title: 'Member',
    items: [
      { label: 'Can invite members', description: 'Allow members to send workspace invitations', enabled: true },
      { label: 'Can create channels', description: 'Allow members to create public channels', enabled: true },
      { label: 'Can delete own messages', description: 'Allow members to delete their own messages', enabled: false },
    ],
  },
  {
    title: 'Guest',
    items: [
      { label: 'Can view files', description: 'Allow guests to view shared files', enabled: true },
      { label: 'Can add reactions', description: 'Allow guests to react to messages', enabled: true },
      { label: 'Can send DMs', description: 'Allow guests to send direct messages', enabled: false },
    ],
  },
]);

const auditLogs = [
  { icon: '?', iconColor: 'bg-indigo-500', title: 'Updated channel permissions', meta: '#engineering', userInitials: 'SC', userColor: 'bg-pink-500', user: 'Sarah Chen', time: '2m ago' },
  { icon: '•', iconColor: 'bg-emerald-500', title: 'Invited new member', meta: 'tom.bradley@contractor.com', userInitials: 'AM', userColor: 'bg-indigo-500', user: 'Alex Morgan', time: '1h ago' },
  { icon: '?', iconColor: 'bg-indigo-500', title: 'Changed workspace name', meta: '"Acme Inc"', userInitials: 'PP', userColor: 'bg-violet-500', user: 'Priya Patel', time: '3h ago' },
  { icon: '?', iconColor: 'bg-red-500', title: 'Deleted message', meta: '#random', userInitials: 'JK', userColor: 'bg-amber-500', user: 'Jordan Kim', time: '5h ago' },
  { icon: '?', iconColor: 'bg-amber-500', title: 'Role changed: tom ? guest', meta: 'Tom Bradley', userInitials: 'AM', userColor: 'bg-indigo-500', user: 'Alex Morgan', time: '1d ago' },
  { icon: '#', iconColor: 'bg-indigo-500', title: 'Created private channel', meta: '#design-2.0', userInitials: 'SC', userColor: 'bg-pink-500', user: 'Sarah Chen', time: '2d ago' },
];

const goBackToApp = async () => {
  const raw = process.client ? localStorage.getItem('appchat_workspace') : null;
  if (raw) {
    try {
      const ws = JSON.parse(raw) as { slug?: string };
      if (ws.slug) {
        await navigateTo(`/workspace/${ws.slug}/channel/general`);
        return;
      }
    } catch {
      // ignore
    }
  }

  await navigateTo('/');
};
</script>
