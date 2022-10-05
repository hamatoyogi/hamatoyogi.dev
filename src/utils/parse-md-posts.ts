import { MarkdownInstance } from 'astro';
import { MdPost, PostItem } from 'src/types/blog-types';

export function parseMdToPostItem(mdPost: MarkdownInstance<MdPost>): PostItem {
  return {
    description: mdPost.frontmatter.description,
    publishDate: mdPost.frontmatter.date,
    title: mdPost.frontmatter.title,
    link: mdPost.url,
  };
}
