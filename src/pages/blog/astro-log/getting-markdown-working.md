---
layout: ../../../components/layouts/markdown-layout/MarkdownLayout.astro
title: Using Markdown with Astro
date: 4 October, 2022
pubDate: 4 October, 2022
draft: false
description: How I'm working with markdown within my Astro site
---

When I started my site with Astro, I wasn't sure how I should write posts for my blog.

My workflow was still not there... I am used to just writing in Notion pages and then copying and pasting my markdown into whatever publishing platform I was using at the time. I'd waste also lots of time to fiddle around with images and formatting a lot.

My Ideal would be that I wouldn't change my writing flow too much, and that I'd be able to just bash out some text and publish it to my site.

As usual, like with most things in code, first I try, then I fail. The first attempt is most likely a fail due to a misunderstanding the correct way to approach the problem, or the right way to use the tech. It's a learning process.

Even now, while writing this post, I'm still not sure this is the right way for me to publish posts. Perfection by iteration is the name of the game.

This post is an `md` file, unlike my first 2 posts on the site, which ended up being `.astro` components. I ended up doing my first 2 posts as Astro components because I wanted more control over the content. It was easier for me to add components that handle images and embeds without thinking about it too much.

The issue I did have with the way I wrote those posts though was the constant bickering with `html` tags, closing and opening them just to write a simple paragraph. It was not ideal, but part of the process. I just wanted to ship something, and that allowed me to do so without diving too deep into the MDX/MD rabbit hole.

I mean, I have used Markdown before, but mostly the basics of it. Who hasn't opened a PR on Github and added some files and formatting? And still, I'm not sure what's the right approach now within my site and using markdown to add an image, nor embed a tweet.

While I write this, I keep re-reading the [Astro docs for markdown content](https://docs.astro.build/en/guides/markdown-content/) and it seems going with `.md` files might not be the right choice for me.

Why? I want to be able to use components within my markdown files. I want to use `@astro/image` to get those sweet image optimizations and I would want to add code components and examples within my posts. I'd also ideally would be able to just pull in posts from my Notion workspace. However, I'm not sure how'd it play out if I embed or add things like images, tweets, and whatnot.

I guess I'll leave this post as an `md` file for now and use the next post to document and try `mdx` and pulling files into my main blog list page.

Overall, being able to just write within my IDE and just push to publish is definitely a far better experience than what I did before. Next iteration is going to be better.
