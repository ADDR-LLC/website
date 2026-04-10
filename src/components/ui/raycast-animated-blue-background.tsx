"use client";

import { UnicornScene } from "unicornstudio-react/next";
import { useSyncExternalStore } from "react";

export function RaycastAnimatedBlueBackground() {
  const mounted = useSyncExternalStore(
    () => () => undefined,
    () => true,
    () => false
  );

  if (!mounted) return <div className="absolute inset-0 bg-[#000000]" />;

  return (
    <div className="absolute inset-0 z-0 opacity-60 mix-blend-screen pointer-events-none">
      <UnicornScene
        projectId="ed7SJMvTJEVxfqzypOOQ"
      />
    </div>
  );
}
