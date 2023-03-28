import { MarkdownInstance } from 'astro';
import { BuilderPost, MdPost, PostItem } from 'src/types/blog-types';
import { formatDate } from './date-formatter';

export function parseMdToPostItem(mdPost: MarkdownInstance<MdPost>): PostItem {
  return {
    description: mdPost.frontmatter.description,
    publishDate: mdPost.frontmatter.date,
    title: mdPost.frontmatter.title,
    link: mdPost.url,
  };
}

export function parseBuilderPostToPostItem(builderPost: BuilderPost): PostItem {
  return {
    description: builderPost.data.blurb,
    publishDate: formatDate({
      date: builderPost.data.date,
      dateStyle: 'medium',
    }),
    title: builderPost.data.title,
    link: `https://www.builder.io/blog/${builderPost.data.handle}`,
  };
}
