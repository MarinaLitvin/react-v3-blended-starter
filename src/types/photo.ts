export interface Photo {
  id: number;
  avg_color: string;
  alt: string;
  src: {
    large: string;
    original: string;
  };
}
