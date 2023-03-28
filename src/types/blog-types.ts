export interface PostItem {
  link: string;
  title: string;
  description: string;
  publishDate: string;
}

export interface MdPost {
  layout: string;
  title: string;
  date: string;
  draft: boolean;
  description: string;
}

export interface BuilderPost {
  data: {
    blurb: string;
    date: number;
    handle: string;
    title: string;
  };
}
