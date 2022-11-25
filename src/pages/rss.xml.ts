import rss from '@astrojs/rss';
import { formatDate } from 'src/utils/date-formatter';

// @ts-ignore
const mdPostImportResult = import.meta.glob('./blog/**/*.md', { eager: true });
const posts = [
  ...Object.values(mdPostImportResult).map((post) => ({
    // @ts-ignore
    link: post.url,
    // @ts-ignore
    title: post.frontmatter.title,
    // @ts-ignore
    pubDate: post.frontmatter.pubDate,
  })),
  {
    link: '/blog/qwik-next-big-thing',
    title: 'Qwik: The Next Big Thing in the Frontend Ecosystem?',
    pubDate: formatDate({ date: '09/25/2022', dateStyle: 'medium' }),
  },
  {
    link: '/blog/astro-log/why-astro',
    title: 'Why Astro',
    pubDate: formatDate({ date: '09/03/2022', dateStyle: 'medium' }),
  },
];

export const get = () =>
  rss({
    title: `Yoav Ganbar's blog`,
    description: 'A Blog by Yoav Ganbar, AKA HamatoYogi',
    // @ts-ignore
    site: import.meta.env.SITE,
    items: posts,
    stylesheet: '/rss/style.xsl',
  });
