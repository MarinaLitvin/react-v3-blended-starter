import style from "./Section.module.css";
import type { ReactNode } from "react";

interface SectionProps {
  children: ReactNode;
}

export default function Section({ children }: SectionProps) {
  return <section className={style.section}>{children}</section>;
}
