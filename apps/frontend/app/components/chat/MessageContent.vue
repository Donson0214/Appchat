<template>
  <p class="mt-0.5 text-[16px] font-normal leading-7 text-slate-800">
    <template v-for="(segment, index) in segments" :key="`${index}-${segment.text}`">
      <button
        v-if="segment.type === 'mention'"
        type="button"
        class="rounded px-0.5 font-semibold text-indigo-600 transition-colors hover:bg-indigo-50"
        @click="onMentionClick(segment)"
      >
        {{ segment.text }}
      </button>
      <span v-else>{{ segment.text }}</span>
    </template>
  </p>
</template>

<script setup lang="ts">
import { computed } from "vue";

type MentionEntity = {
  userId: string | null;
  displayName: string;
  mentionKey: string;
  start: number;
  end: number;
};

type MentionSegment = {
  type: "text" | "mention";
  text: string;
  mention?: MentionEntity;
};

const props = withDefaults(
  defineProps<{
    text: string;
    mentions?: MentionEntity[];
  }>(),
  {
    mentions: () => [],
  },
);

const emit = defineEmits<{
  (event: "mention-click", mention: MentionEntity): void;
}>();

const segments = computed<MentionSegment[]>(() => {
  if (!props.mentions.length) {
    return [{ type: "text", text: props.text }];
  }

  const sorted = [...props.mentions]
    .filter((item) => item.start >= 0 && item.end > item.start && item.end <= props.text.length)
    .sort((a, b) => a.start - b.start);

  const result: MentionSegment[] = [];
  let cursor = 0;

  for (const mention of sorted) {
    if (mention.start < cursor) {
      continue;
    }

    if (mention.start > cursor) {
      result.push({
        type: "text",
        text: props.text.slice(cursor, mention.start),
      });
    }

    result.push({
      type: "mention",
      text: props.text.slice(mention.start, mention.end),
      mention,
    });
    cursor = mention.end;
  }

  if (cursor < props.text.length) {
    result.push({
      type: "text",
      text: props.text.slice(cursor),
    });
  }

  return result.length ? result : [{ type: "text", text: props.text }];
});

const onMentionClick = (segment: MentionSegment) => {
  if (segment.type !== "mention" || !segment.mention) {
    return;
  }
  emit("mention-click", segment.mention);
};
</script>
