import type { Member } from "../../content/types";
import { useInView } from "../../hooks/useInView";

type MemberCardProps = {
  member: Member;
  index: number;
};

export default function MemberCard({ member, index }: MemberCardProps) {
  const { ref, inView } = useInView<HTMLLIElement>();

  return (
    <li
      ref={ref}
      className={inView ? "group reveal reveal-visible" : "group reveal"}
      style={{ transitionDelay: `${index * 90}ms` }}
    >
      <div className="glass h-full rounded-2xl p-5 transition-transform duration-200 group-hover:-translate-y-1">
        <div className="flex items-center gap-4">
          <div className="grid h-11 w-11 place-items-center rounded-full bg-linear-to-br from-white/20 to-white/5 ring-1 ring-white/30">
            <img
              src="/favicon.png"
              alt="Stellarmelt logo"
              className="h-7 w-7 object-contain select-none"
              draggable={false}
            />
          </div>
          <div>
            <h3 className="font-semibold">{member.name}</h3>
            <p className="text-sm text-white/70">{member.role}</p>
          </div>
        </div>
        <p className="mt-4 text-white/80">{member.blurb}</p>
      </div>
    </li>
  );
}
