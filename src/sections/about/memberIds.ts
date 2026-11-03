// The panel the moons control, each moon's button and each member's name.
export const memberPanelId = "about-member-panel";

export function moonId(slug: string): string {
  return `about-moon-${slug}`;
}

export function memberTitleId(slug: string): string {
  return `about-name-${slug}`;
}
