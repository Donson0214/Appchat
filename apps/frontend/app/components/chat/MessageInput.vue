<template>
  <div class="border-t border-slate-300 px-6 pb-6 pt-3">
    <div class="rounded-md border border-slate-300 bg-white">
      <div class="flex items-center gap-4 border-b border-slate-200 px-5 py-3 text-slate-400">
        <button class="text-[16px] font-semibold text-slate-500">B</button>
        <button class="text-[16px]">I</button>
        <span class="h-5 w-px bg-slate-300" />
        <button class="inline-flex h-5 w-5 items-center justify-center">
          <svg viewBox="0 0 20 20" class="h-4 w-4 fill-current">
            <path d="M7.2 13.8a3 3 0 0 1 0-4.3L9 7.6a3 3 0 0 1 4.2 4.3l-.6.6a1 1 0 1 1-1.4-1.4l.6-.6a1 1 0 1 0-1.4-1.4L8.6 11a1 1 0 1 0 1.4 1.4l.4-.4a1 1 0 1 1 1.4 1.4l-.4.4a3 3 0 0 1-4.2 0Zm5.6-7.6a3 3 0 0 1 0 4.2L11 12.3a3 3 0 1 1-4.2-4.3l.6-.6a1 1 0 1 1 1.4 1.4l-.6.6a1 1 0 1 0 1.4 1.4l1.8-1.8a1 1 0 0 0-1.4-1.4l-.4.4A1 1 0 1 1 8.2 6.6l.4-.4a3 3 0 0 1 4.2 0Z" />
          </svg>
        </button>
      </div>

      <div class="relative">
        <textarea
          ref="textareaRef"
          v-model="draft"
          class="h-[86px] w-full resize-none bg-transparent px-5 py-4 text-[16px] font-normal leading-7 text-slate-700 placeholder:font-normal placeholder:text-slate-400 focus:outline-none"
          :placeholder="placeholderText"
          @keydown="onTextareaKeydown"
          @input="syncCursor"
          @click="syncCursor"
          @keyup="syncCursor"
        />

        <div
          v-if="suggestionsOpen && mentionSuggestions.length"
          class="absolute left-5 top-[62px] z-20 w-[320px] rounded-md border border-slate-200 bg-white p-1 shadow-[0_10px_24px_rgba(15,23,42,0.18)]"
        >
          <button
            v-for="(item, index) in mentionSuggestions"
            :key="`${item.id}-${item.handle}`"
            type="button"
            class="flex w-full items-center justify-between rounded-md px-2.5 py-2 text-left"
            :class="index === activeSuggestionIndex ? 'bg-indigo-50' : 'hover:bg-slate-50'"
            @mousedown.prevent="selectSuggestion(index)"
          >
            <span class="min-w-0">
              <span class="block truncate text-[13px] font-semibold text-slate-800">{{ item.displayName }}</span>
              <span class="block truncate text-[12px] text-slate-500">@{{ item.handle }}</span>
            </span>
            <span class="ml-2 truncate text-[11px] text-slate-400">{{ item.emailSnippet }}</span>
          </button>
        </div>
      </div>

      <p v-if="mentionWarning" class="px-4 pb-2 text-xs text-amber-700">{{ mentionWarning }}</p>

      <div class="flex items-center justify-between px-4 pb-4 text-slate-400">
        <div class="flex items-center gap-4">
          <button class="inline-flex h-8 w-8 items-center justify-center rounded-md transition-colors duration-200 hover:bg-slate-100">
            <svg viewBox="0 0 20 20" class="h-5 w-5 fill-current">
              <path d="M6.3 2.5a3 3 0 0 1 3 3v7.8a1.7 1.7 0 1 0 3.4 0V5.7a3.7 3.7 0 1 0-7.4 0v7.8a5.4 5.4 0 0 0 10.8 0V8a1 1 0 1 1 2 0v5.4a7.4 7.4 0 1 1-14.8 0V5.7a5.7 5.7 0 1 1 11.4 0v7.6a3.7 3.7 0 1 1-7.4 0V5.5a1 1 0 0 1 2 0v7.8a1.7 1.7 0 1 0 3.4 0V5.7a3 3 0 0 0-3-3Z" />
            </svg>
          </button>
          <button class="inline-flex h-8 w-8 items-center justify-center rounded-md transition-colors duration-200 hover:bg-slate-100">
            <svg viewBox="0 0 20 20" class="h-5 w-5 fill-current">
              <path d="M10 2.5a7.5 7.5 0 1 0 0 15 7.5 7.5 0 0 0 0-15Zm0 2a5.5 5.5 0 0 1 4.4 8.8h-8.8A5.5 5.5 0 0 1 10 4.5Zm0 11a5.5 5.5 0 0 1-2.8-.8h5.6a5.5 5.5 0 0 1-2.8.8Zm-2.2-5a1.2 1.2 0 1 1 0-2.4 1.2 1.2 0 0 1 0 2.4Zm4.4 0a1.2 1.2 0 1 1 0-2.4 1.2 1.2 0 0 1 0 2.4Z" />
            </svg>
          </button>
          <button class="inline-flex h-8 w-8 items-center justify-center rounded-md text-[26px] leading-none transition-colors duration-200 hover:bg-slate-100">@</button>
        </div>

        <button
          type="button"
          class="inline-flex h-11 w-11 items-center justify-center rounded-md text-[18px] text-white transition-all duration-200 ease-in-out"
          :class="canSend ? 'bg-indigo-600 hover:-translate-y-px hover:brightness-105' : 'bg-indigo-300'"
          aria-label="Send message"
          @click="submit"
        >
          <svg viewBox="0 0 20 20" class="h-5 w-5 fill-current">
            <path d="M2.4 10.8 15.5 4c1-.5 2 .5 1.5 1.5L10.2 18.6c-.4.8-1.6.7-1.8-.2L7 12.8 1.4 11.8c-.9-.2-1.1-1.4 0-1.8Zm5.2.2.8 3.1 4.4-8.5L7.6 11Z" />
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, ref, watch } from "vue";
import { useMessageApi } from "../../composables/use-message-api";

type MentionSuggestion = {
  id: string;
  displayName: string;
  handle: string;
  avatarUrl: string | null;
  emailSnippet: string;
};

const emit = defineEmits<{
  (event: "send", content: string): void;
}>();

const props = withDefaults(
  defineProps<{
    workspaceId?: string;
    channelRef?: string;
    channelName?: string;
    isDirectMessage?: boolean;
  }>(),
  {
    workspaceId: "",
    channelRef: "",
    channelName: "general",
    isDirectMessage: false,
  },
);

const { suggestMentions, resolveMentions } = useMessageApi();

const textareaRef = ref<HTMLTextAreaElement | null>(null);
const draft = ref("");
const cursorPosition = ref(0);
const mentionQuery = ref<{ start: number; query: string } | null>(null);
const mentionSuggestions = ref<MentionSuggestion[]>([]);
const suggestionsOpen = ref(false);
const activeSuggestionIndex = ref(0);
const mentionWarning = ref("");

let suggestionTimer: ReturnType<typeof setTimeout> | null = null;

const canSend = computed(() => draft.value.trim().length > 0);
const placeholderText = computed(() =>
  props.isDirectMessage ? `Message ${props.channelName}` : `Message #${props.channelName}`,
);

const syncCursor = () => {
  if (!textareaRef.value) return;
  cursorPosition.value = textareaRef.value.selectionStart ?? 0;
};

const detectMentionQuery = () => {
  const before = draft.value.slice(0, cursorPosition.value);
  const match = /(^|\s)@([a-zA-Z0-9._-]{0,64})$/.exec(before);
  if (!match) {
    mentionQuery.value = null;
    suggestionsOpen.value = false;
    return;
  }
  const fragment = match[2] ?? "";
  const start = before.length - fragment.length - 1;
  mentionQuery.value = { start, query: fragment };
};

const loadSuggestions = async () => {
  if (!mentionQuery.value || !props.workspaceId) {
    mentionSuggestions.value = [];
    suggestionsOpen.value = false;
    return;
  }

  try {
    const result = await suggestMentions(props.workspaceId, mentionQuery.value.query, props.channelRef || undefined);
    mentionSuggestions.value = result.items;
    activeSuggestionIndex.value = 0;
    suggestionsOpen.value = result.items.length > 0;
  } catch {
    mentionSuggestions.value = [];
    suggestionsOpen.value = false;
  }
};

watch([draft, cursorPosition], () => {
  detectMentionQuery();
  if (suggestionTimer) {
    clearTimeout(suggestionTimer);
  }
  suggestionTimer = setTimeout(() => {
    void loadSuggestions();
  }, 120);
});

const selectSuggestion = (index: number) => {
  if (!mentionQuery.value || !textareaRef.value || !mentionSuggestions.value[index]) {
    return;
  }

  const choice = mentionSuggestions.value[index];
  const before = draft.value.slice(0, mentionQuery.value.start);
  const after = draft.value.slice(cursorPosition.value);
  const mentionText = `@${choice.handle} `;
  draft.value = `${before}${mentionText}${after}`;
  mentionWarning.value = "";
  suggestionsOpen.value = false;
  mentionQuery.value = null;

  nextTick(() => {
    if (!textareaRef.value) return;
    const pos = before.length + mentionText.length;
    textareaRef.value.focus();
    textareaRef.value.setSelectionRange(pos, pos);
    cursorPosition.value = pos;
  });
};

const onTextareaKeydown = (event: KeyboardEvent) => {
  if (suggestionsOpen.value && mentionSuggestions.value.length) {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      activeSuggestionIndex.value =
        (activeSuggestionIndex.value + 1) % mentionSuggestions.value.length;
      return;
    }
    if (event.key === "ArrowUp") {
      event.preventDefault();
      activeSuggestionIndex.value =
        (activeSuggestionIndex.value - 1 + mentionSuggestions.value.length) %
        mentionSuggestions.value.length;
      return;
    }
    if (event.key === "Enter" || event.key === "Tab") {
      event.preventDefault();
      selectSuggestion(activeSuggestionIndex.value);
      return;
    }
    if (event.key === "Escape") {
      event.preventDefault();
      suggestionsOpen.value = false;
      return;
    }
  }

  if (event.key === "Enter" && !event.shiftKey) {
    event.preventDefault();
    void submit();
  }
};

const submit = async () => {
  const content = draft.value.trim();
  if (!content) {
    return;
  }

  mentionWarning.value = "";
  if (props.workspaceId && props.channelRef) {
    try {
      const resolution = await resolveMentions(props.workspaceId, props.channelRef, content);
      const unresolved = resolution.unresolved.map((item) => `@${item.mentionKey}`);
      const ambiguous = resolution.ambiguous.map((item) => `@${item.mentionKey}`);
      if (unresolved.length || ambiguous.length) {
        const unresolvedText = unresolved.length ? `Unresolved: ${unresolved.join(", ")}.` : "";
        const ambiguousText = ambiguous.length ? `Ambiguous: ${ambiguous.join(", ")}.` : "";
        mentionWarning.value = `${unresolvedText} ${ambiguousText}`.trim();
        return;
      }
    } catch {
      mentionWarning.value = "Unable to verify mentions right now.";
      return;
    }
  }

  emit("send", content);
  draft.value = "";
  mentionSuggestions.value = [];
  suggestionsOpen.value = false;
};
</script>
