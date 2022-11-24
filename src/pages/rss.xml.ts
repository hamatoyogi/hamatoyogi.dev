import rss from '@astrojs/rss';

export const get = () =>
  rss({
    title: `Yoav Ganbar's blog`,
    description: 'A Blog by Yoav Ganbar, AKA HamatoYogi',
    site: import.meta.env.SITE,
    items: import.meta.glob('./blog/**/*.*'),
  });
