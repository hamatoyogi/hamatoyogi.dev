---
layout: ../../../components/layouts/markdown-layout/MarkdownLayout.astro
title: Connecting Builder.io's Visual CMS to Astro
date: 10 November, 2022
pubDate: 10 November, 2022
draft: false
description: How to connect Builder.io's Visual CMS to your Astro website.
---

I am a lazy developer. But aren’t we all?

I remember hearing somewhere that the more a developer is lazy, the better they are. This probably relates to the fact of not repeating tasks, sharing code, and of course the good ol’ copy pasta.

There’s even [a special product for that](https://drop.com/buy/stack-overflow-the-key-macropad)! (this is not an affiliate link, I just generally find it funny 😂).

But why do we still do some things over and over again? Like, changing our marketing pages, banners, button colors and what not. Why does a developer need to go through the rounds of being asked to reposition some element on a page, just because the PM or designer thought it’d be better like that? Seems like a lot of wasted time…

That’s why I was super stoked when I learned about [Builder.io](http://Builder.io). Finally a tool that can help me on many of these fronts.

Builder can be used for many things:

- A headless CMS or storefront for ecommerce.
- Visually building landing pages.
- Building marketing / company websites.
- As a Shopify storefront.
- Building mobile apps.
- Creating and publishing a blog.

## CMSs FTW

First and foremost, Builder is a CMS. What is a CMS? You might ask. It stands for Content Management System.

> There are generally 2 types of CMSs:
>
> 1. Hosted / Traditional CMS - like WordPress or Drupal, is a monolith that connects the front-end and the back-end of a website in a neat and easy application code base. They contain everything from the database for content all the way up through the presentation layer.
> 2. Headless CMS - Does not connect to the frontend at all, deals strictly with the content via API.

When veteran devs think of CMS’s they usually think of Wordpress, Joomla, and Drupal. These have always been a fully fledged solution of dealing with content, from storing the data, down to rendering the website. However the new wave of CMSs are mostly data stores. Wherein you only access your data via an API, and what you do with the data is up to the developer.

Builder has taken a different approach. Allowing not only the access to data, but also access to the visuals - the actual UI components. The developer can decide how much control can be given to non-dev team members.

Most CMSs allow editing content via a WYSIWYG (What You See Is What You Get) and sometimes a drag and drop interfaces. Builder can also integrate with many different frontend stacks, like React, Angular, Vue, and more. They way it achieves this is by allowing developers to register components to Builder via their SDK.

## Querying Data and Using The Builder Visual CMS

Builder is really flexible in it’s offerings, as I’ve mentioned. You have different ways to achieve the same goal. It all depends on what works for you and/or your team.

I’ve had a great experience integrating Builder into the project I was working on in my previous position. I needed to solve a few problems:

1. Allow marketing and design teams to publish blog posts, while keeping some design consistent and constraint.
2. Allow FAQ page to be edited by non devs.
3. Make different content on the home page and other marketing pages easily editable without opening tickets for developers.

Luckily for us, our stack was a Next.js app, and the Builder team had great docs and code example that were very close to our needs. With that being said, it was close, but not exact… I had to try a few different variations till I found something that made enough sense to me.

> Side note: I did get a chance to pass on my feedback to a Product Manager at Builder, and I was told that later on that was part of the inspiration for [“Builder Blueprints”](https://www.builder.io/c/blueprints/homepage) 😃

I’ll have to go by memory, as I no longer have access to the codebase, nor Builder account. However, as I recall, it was a pretty straight forward approach for both problems 1 and 2.

- Define the section/data/page model on Builder (in my case The model consisted of: author, title, image, description, slug, createdAt, etc.)
- Integrate Builder to the app via API key.
- Initialize Builder on the page you want the data.
- Query via Builder API and get your data.
- Use `BuilderComponent` for content from Builder Visual CMS.

For the general index page of the blog, this looked something like this (see [Builder docs](https://www.builder.io/c/docs/integrate-cms-data)):

```tsx
// pages/blog/index.tsx

import { builder } from '@builder.io/react';

import { Header } from '~components/header';
import { Footer } from '~components/footer';
import { Post } from '~components/post';

builder.init(process.env.NEXT_PUBLIC_BUILDER_API_KEY);

// If you are unfamiliar with Next.js this method is what allows you to get data
// for static pages at build time.
// Here we get our data model "blog-article" from builder, but we don't include
// all the content blocks, as we only need surface data.
export const getStaticProps = async ({ req, res, query }) => {
  const page = Number(query?.page) || 0;
  const articles = await builder.getAll('blog-article', {
    req,
    res,
    // Include references, like our `author` ref
    options: { includeRefs: true },
    // For performance, don't pull the `blocks` (the full blog entry content)
    // when listing
    omit: 'data.blocks',
    limit: articlesPerPage,
    offset: page * articlesPerPage,
  });

  return { props: { articles }, revalidate: 5 };
};

//

const Blog = ({ articles }) => {
  return (
    <>
      <Header />
      <main>
        {articles.map((article) => {
          return (
            <Post
              key={article.id}
              slug={article?.data.slug}
              title={article?.data?.title}
              imagePath={article?.data?.image}
              author={{
                name: article?.data?.author?.value?.data?.fullName,
              }}
              tags={article?.data?.tags?.map(({ tag }) => tag)}
              createdAt={article?.data?.date}
            >
              {article?.data?.description}
            </Post>
          );
        })}
      </main>
      <Footer />
    </>
  );
};

export default Blog;
```

Now, let’s have a look at how a blog page looks like:

```tsx
// pages/blog/[slug].tsx

...

builder.init(process.env.NEXT_PUBLIC_BUILDER_API_KEY);

// we use Next.js's dynamic params to get the post slug and query builder
// one slug at a time.

export const getStaticProps = async ({ req, res, params: { slug } }) => {
  const article = await builder
    .get('blog-article', {
      req,
      res,
      // Include references, like our `author` ref
      options: { includeRefs: true },
      query: {
        // Get the specific article by slug
        'data.slug': slug,
      },
    })
    .promise();

  if (!article) {
    return {
      notFound: true,
    };
  }

  return { props: { article: article || null, revalidate: 5 } };
};

export async function getStaticPaths() {
  // Get a list of all blog article pages in builder
  const pages = await builder.getAll('blog-article', {
    // We only need the "slug" field
    fields: 'data.slug',
    options: { noTargeting: true },
  });
  const paths = pages.map((page) => ({ params: { slug: page.data?.slug } }));

  return {
    paths,
    fallback: 'blocking',
  };
}

const BlogArticle = ({ article }: { article: IBlogArticle }) => {
  const author = article?.data?.author?.value;
  return (
    <>
      <Header />
      <main>
       <h1 className="h300 mt-6 max-w-4xl text-center lg:h500">
          {article?.data?.title}
       </h1>
       <div className="mt-10 flex items-center justify-center md:mt-8">
         <Avatar
           src={author?.data?.photo}
         />
         <Image
            src={article?.data?.image}
            alt={article?.data?.heroImageAltText}
            layout="fill"
            quality={100}
            objectFit="cover"
            priority
          />
			 </div>
       <BuilderComponent
         name="blog-article"
         content={article as unknown}
       />
      </main>
      <Footer />
    </>
  );
};

export default BlogArticle;
```

Pretty sweet, no? We managed to hand off the blog content to Builders platform while still keeping control of out layout.

For the FAQ page the approach was the same as the single blog page.

As for the number 3 (making sections editable from builder that would reflect on the homepage), the approach was to define the data model, query it on the data fetching method, and pass on the data via props. This worked utilizing Next.js’s [ISR strategy](https://nextjs.org/docs/basic-features/data-fetching/incremental-static-regeneration), so any change to data would propagate on a next user visit.

So now that we’ve seen how the approach works within a Next.js app, let’s dig in and see how we’d do this with Astro.

## Connecting Builder To Astro

For the sake of this post, I’ll create a new Astro project and a new Builder account. You can follow along or [head straight to the repo](https://github.com/hamatoyogi/astro-builder) if you’re impatient 🙂.

### Initial Setup

We’ll start by creating a new Astro project:

```tsx
npm create astro@latest
```

Head on to the [Builder.IO](http://Builder.IO) website and create an account.

The first thing we’ll attempt doing is have a page in Astro which is powered by Builder Visual CMS.

Starting off a new Builder project, you have one model that is the page model:

![Builder Content models](/images/builder-astro/content-models.png)

To create our first Builder page content follow these steps:

#### 1. Click on Content

![https://images.tango.us/workflows/f28f33d5-ed12-45ef-a5c2-be9936eb43d1/steps/691ffdba-698d-4dd0-8412-beff5f454514/56017198-6e87-4209-bff9-b89987dc3155.png?fm=png&crop=focalpoint&fit=crop&fp-x=0.1017&fp-y=0.1208&fp-z=2.4146&w=1200&mark-w=0.2&mark-pad=0&mark64=aHR0cHM6Ly9pbWFnZXMudGFuZ28udXMvc3RhdGljL21hZGUtd2l0aC10YW5nby13YXRlcm1hcmsucG5n&ar=1682%3A1155](https://images.tango.us/workflows/f28f33d5-ed12-45ef-a5c2-be9936eb43d1/steps/691ffdba-698d-4dd0-8412-beff5f454514/56017198-6e87-4209-bff9-b89987dc3155.png?fm=png&crop=focalpoint&fit=crop&fp-x=0.1017&fp-y=0.1208&fp-z=2.4146&w=1200&mark-w=0.2&mark-pad=0&mark64=aHR0cHM6Ly9pbWFnZXMudGFuZ28udXMvc3RhdGljL21hZGUtd2l0aC10YW5nby13YXRlcm1hcmsucG5n&ar=1682%3A1155)

#### 2. Create a homepage "page"

![https://images.tango.us/workflows/f28f33d5-ed12-45ef-a5c2-be9936eb43d1/steps/a79112a9-a1fb-413c-bb8e-4ac2ff9a4c59/5ad6014d-9b8b-4614-bcf8-9444bccc962a.png?fm=png&crop=focalpoint&fit=crop&fp-x=0.3986&fp-y=0.1571&fp-z=1.9387&w=1200&mark-w=0.2&mark-pad=0&mark64=aHR0cHM6Ly9pbWFnZXMudGFuZ28udXMvc3RhdGljL21hZGUtd2l0aC10YW5nby13YXRlcm1hcmsucG5n&ar=1682%3A1155](https://images.tango.us/workflows/f28f33d5-ed12-45ef-a5c2-be9936eb43d1/steps/a79112a9-a1fb-413c-bb8e-4ac2ff9a4c59/5ad6014d-9b8b-4614-bcf8-9444bccc962a.png?fm=png&crop=focalpoint&fit=crop&fp-x=0.3986&fp-y=0.1571&fp-z=1.9387&w=1200&mark-w=0.2&mark-pad=0&mark64=aHR0cHM6Ly9pbWFnZXMudGFuZ28udXMvc3RhdGljL21hZGUtd2l0aC10YW5nby13YXRlcm1hcmsucG5n&ar=1682%3A1155)

---

Here is the first snafu I ran into. Unlike Next.js, there are no integration docs for Astro… So, I went looking at [“integrating Pages”](https://www.builder.io/c/docs/integrating-builder-pages) page. Over there, they’re examples of how to connect different meta frameworks and frontend frameworks, but as I’ve mentioned no Astro. Among the options that are laid out, the only option that might be something to work with was the “Rest API” doc:

![API Options](/images/builder-astro/api-options.png)

The issue that I came across at first was the code shown on that page was an example of an express app integration. Being that Astro is static by nature, I assumed that just fetching the data from builder would just work and I’d be able to pass it down to my Astro page and be on with it.

At this point I was not able to use the visual CMS nor get data for my content… 🤨

It’s a chicken and the egg kind of problem. I want to get data from the visual CMS, but I cannot create something via Builder if things aren’t hooked up correctly.

The app UI painstakingly tells me that it can’t connect to my site:

![Trouble connecting](/images/builder-astro/trouble-connecting.png)

Reading further on the “Integrating Pages” doc I find the key piece of information that I was missing:

![HTML API tip](/images/builder-astro/outlined-tip.png)

That link leads to the [“Previewing content on your site”](https://www.builder.io/c/docs/html-api#previewing-content) section (inside Builder HTML API page) - where lies the way to get Builder’s preview working with the HTML api. A bit of a loop de loop inside the docs, just to get to it. Now with that knowledge we can go back to our code and fix our Astro page:

```tsx
// src/pages/homepage.astro

---
import Layout from '../layouts/Layout.astro';

// the initial code for attempting to get our data from builder
// this does nothing at the moment

// keeping the API key inside our .env file
// for more information: https://docs.astro.build/en/guides/environment-variables/#setting-environment-variables
const apiKey = import.meta.env.BUILDER_API_KEY;

const handleError = (err) => {
  console.log(err);
  // The requested Builder content could not be found.
  if (err.response.status === 404) {
    return { data: null };
  }
  throw err;
};

const encodedUrl = encodeURIComponent('/homepage');

const { data: pageData } = await fetch(
  `https://cdn.builder.io/api/v1/html/page?apiKey=${apiKey}&url=${encodedUrl}`
)
  .then((res) => res.json())
  .catch(handleError);

---

<Layout title='Welcome to Astro Builder'>
  <h1>home page</h1>
  <builder-component model='page' api-key={apiKey} />
  <script async src='https://cdn.builder.io/js/webcomponents'></script>
</Layout>

<style>
// ...
</style>
```

With that in place we can start using the visual CMS to build our home page!

![Empty Home Page](/images/builder-astro/empty-homepage.png)

So now we can add some content:

![Home page with content](/images/builder-astro/homepage-with-content.png)

Now we can click the “Publish” button and see what’s next.

![https://images.tango.us/workflows/aafaff0f-401b-43c4-8bab-84f1221f6f78/steps/ae51e22f-081e-45c8-8af9-9465fdd91acc/d9ace7de-7ff0-4d30-8673-c68e9baca04c.png?fm=png&crop=focalpoint&fit=crop&fp-x=0.9551&fp-y=0.0229&fp-z=3.0925&w=1200&mark-w=0.2&mark-pad=0&mark64=aHR0cHM6Ly9pbWFnZXMudGFuZ28udXMvc3RhdGljL21hZGUtd2l0aC10YW5nby13YXRlcm1hcmsucG5n&ar=1682%3A1070](https://images.tango.us/workflows/aafaff0f-401b-43c4-8bab-84f1221f6f78/steps/ae51e22f-081e-45c8-8af9-9465fdd91acc/d9ace7de-7ff0-4d30-8673-c68e9baca04c.png?fm=png&crop=focalpoint&fit=crop&fp-x=0.9551&fp-y=0.0229&fp-z=3.0925&w=1200&mark-w=0.2&mark-pad=0&mark64=aHR0cHM6Ly9pbWFnZXMudGFuZ28udXMvc3RhdGljL21hZGUtd2l0aC10YW5nby13YXRlcm1hcmsucG5n&ar=1682%3A1070)

We were able to create our home page content model and actually see it render within our app, however, to do so we’ve added a web component to our Astro page. That means, we’d need JavaScript to be able to render the page. This is not ideal, as Astro is static first, and we would want to be able to get that content statically.

At this point, If we build our Astro project with:

```tsx
npm run build
```

We can then run the production build with:

```tsx
npm run preview
```

Then we can go to `[localhost:3000/homepage](http://localhost:3000/homepage)` and pop up our devtools, we can see 2 things:

1. Looking at the network there’s an http request to Builder’s CDN to get their web component script:

   ![Network tab web component](/images/builder-astro/network-1.png)

2. if we disable JS we don’t get our content from Builder:

   ![Home pgae without web component](/images/builder-astro/homepage-network-wc.png)

## Connecting with HTML API and Static Rendering

Now let’s see how we can get our pre rendered content from builder, so we can have a completely static page.

If we go back to our Astro code on `homepage.astro` we can now see in our terminal output that we do get data from builder:

```tsx
// src/pages/homepage.astro

---
...

const apiKey = import.meta.env.BUILDER_API_KEY;

...
const encodedUrl = encodeURIComponent('/homepage');

const { data: pageData } = await fetch(
  `https://cdn.builder.io/api/v1/html/page?apiKey=${apiKey}&url=${encodedUrl}`
)
  .then((res) => res.json())
  .catch(handleError);

---

...
```

Logging the `pageData` response we can see we get an object with an `html` property:

```json
{
  "createdBy": "9EsPg4I95mcHGVqloFHcEqq2dop2",
  "createdDate": 1667036699251,
  "data": {
    "themeId": false,
    "title": "Homepage",
    "url": "/homepage",
    "html": "<builder-component rev=\"w7gjtbab0p8\" api-key=\"b5760280b2464ac990288c03c4b8b1bc\" name=\"page\" entry=\"e18ae8ea06cd41a6a69f4d178de4dc1c\">\n\n<!-- ***** Generated by Builder.io on Sat, 29 Oct 2022 15:39:21 GMT ***** -->\n\n<style type=\"text/css\" class=\"builder-styles builder-api-styles\">/*start:h47494*/.css-h47494{display:-webkit-box;display:-webkit-flex;display:-ms-flexbox;display:flex;-webkit-flex-direction:column;-ms-flex-direction:column;flex-direction:column;-webkit-align-items:stretch;-webkit-box-align:stretch;-ms-flex-align:stretch;align-items:stretch;}/*end:h47494*/ /*start:hgfgng*/.css-hgfgng.builder-block{display:-webkit-box;display:-webkit-flex;display:-ms-flexbox;display:flex;-webkit-flex-direction:column;-ms-flex-direction:column;flex-direction:column;position:relative;-webkit-flex-shrink:0;-ms-flex-negative:0;flex-shrink:0;box-sizing:border-box;margin-top:20px;line-height:normal;height:auto;}/*end:hgfgng*/ /*start:1qggkls*/.css-1qggkls{outline:none;}.css-1qggkls p:first-of-type,.css-1qggkls .builder-paragraph:first-of-type{margin:0;}.css-1qggkls > p,.css-1qggkls .builder-paragraph{color:inherit;line-height:inherit;-webkit-letter-spacing:inherit;-moz-letter-spacing:inherit;-ms-letter-spacing:inherit;letter-spacing:inherit;font-weight:inherit;font-size:inherit;text-align:inherit;font-family:inherit;}/*end:1qggkls*/ /*start:q80dxn*/.css-q80dxn.builder-block{display:-webkit-box;display:-webkit-flex;display:-ms-flexbox;display:flex;-webkit-flex-direction:column;-ms-flex-direction:column;flex-direction:column;position:relative;-webkit-flex-shrink:0;-ms-flex-negative:0;flex-shrink:0;box-sizing:border-box;margin-top:20px;-webkit-box-pack:center;-webkit-justify-content:center;-ms-flex-pack:center;justify-content:center;opacity:0;-webkit-transform:translate3d(0,20px,0);-ms-transform:translate3d(0,20px,0);transform:translate3d(0,20px,0);}/*end:q80dxn*/ /*start:1840m1q*/.css-1840m1q{display:-webkit-box;display:-webkit-flex;display:-ms-flexbox;display:flex;}@media (max-width:999px){.css-1840m1q{-webkit-flex-direction:column;-ms-flex-direction:column;flex-direction:column;-webkit-align-items:stretch;-webkit-box-align:stretch;-ms-flex-align:stretch;align-items:stretch;}}/*end:1840m1q*/ /*start:2keume*/.css-2keume{display:-webkit-box;display:-webkit-flex;display:-ms-flexbox;display:flex;-webkit-flex-direction:column;-ms-flex-direction:column;flex-direction:column;-webkit-align-items:stretch;-webkit-box-align:stretch;-ms-flex-align:stretch;align-items:stretch;line-height:normal;width:calc(50% - 10px);margin-left:0;}.css-2keume > .builder-blocks{-webkit-box-flex:1;-webkit-flex-grow:1;-ms-flex-positive:1;flex-grow:1;}@media (max-width:999px){.css-2keume{width:100%;margin-left:0;}}/*end:2keume*/ /*start:dichlt*/.css-dichlt.builder-block{display:-webkit-box;display:-webkit-flex;display:-ms-flexbox;display:flex;-webkit-flex-direction:column;-ms-flex-direction:column;flex-direction:column;position:relative;-webkit-flex-shrink:0;-ms-flex-negative:0;flex-shrink:0;box-sizing:border-box;margin-top:auto;-webkit-appearance:none;-moz-appearance:none;appearance:none;padding-top:15px;padding-bottom:15px;padding-left:25px;padding-right:25px;background-color:black;color:white;border-radius:4px;text-align:center;cursor:pointer;margin-bottom:auto;}/*end:dichlt*/ /*start:bst442*/.css-bst442{display:-webkit-box;display:-webkit-flex;display:-ms-flexbox;display:flex;-webkit-flex-direction:column;-ms-flex-direction:column;flex-direction:column;-webkit-align-items:stretch;-webkit-box-align:stretch;-ms-flex-align:stretch;align-items:stretch;line-height:normal;width:calc(50% - 10px);margin-left:20px;}.css-bst442 > .builder-blocks{-webkit-box-flex:1;-webkit-flex-grow:1;-ms-flex-positive:1;flex-grow:1;}@media (max-width:999px){.css-bst442{width:100%;margin-left:0;}}/*end:bst442*/ /*start:1xp67e9*/.css-1xp67e9.builder-block{display:-webkit-box;display:-webkit-flex;display:-ms-flexbox;display:flex;-webkit-flex-direction:column;-ms-flex-direction:column;flex-direction:column;position:relative;-webkit-flex-shrink:0;-ms-flex-negative:0;flex-shrink:0;box-sizing:border-box;margin-top:20px;width:100%;min-height:20px;min-width:20px;overflow:hidden;margin-left:auto;margin-right:auto;max-width:200px;height:auto;-webkit-box-flex:1;-webkit-flex-grow:1;-ms-flex-positive:1;flex-grow:1;}/*end:1xp67e9*/ /*start:12153wi*/.css-12153wi{opacity:1;-webkit-transition:opacity 0.2s ease-in-out;transition:opacity 0.2s ease-in-out;object-fit:cover;object-position:center;position:absolute;height:100%;width:100%;left:0;top:0;}/*end:12153wi*/ /*start:1aa8xmo*/.css-1aa8xmo{width:100%;padding-top:149.9%;pointer-events:none;font-size:0;}/*end:1aa8xmo*/ /*start:qguwqq*/.css-qguwqq.builder-block{display:-webkit-box;display:-webkit-flex;display:-ms-flexbox;display:flex;-webkit-flex-direction:column;-ms-flex-direction:column;flex-direction:column;position:relative;-webkit-flex-shrink:0;-ms-flex-negative:0;flex-shrink:0;box-sizing:border-box;margin-top:20px;line-height:normal;height:auto;text-align:center;}/*end:qguwqq*/ /*start:1mvsfya*/.css-1mvsfya.builder-block{height:0;width:0;display:inline-block;opacity:0;overflow:hidden;pointer-events:none;}/*end:1mvsfya*/</style><div class=\"builder-component builder-component-e18ae8ea06cd41a6a69f4d178de4dc1c\" data-name=\"page\" data-source=\"Rendered by Builder.io\"><div class=\"builder-content\" builder-content-id=\"e18ae8ea06cd41a6a69f4d178de4dc1c\" builder-model=\"page\"><div data-builder-component=\"page\" data-builder-content-id=\"e18ae8ea06cd41a6a69f4d178de4dc1c\" data-builder-variation-id=\"e18ae8ea06cd41a6a69f4d178de4dc1c\"><style data-emotion-css=\"h47494\"></style><div class=\"builder-blocks css-h47494\" builder-type=\"blocks\"><style data-emotion-css=\"hgfgng\"></style><div class=\"builder-block builder-15820be824444228ace6b6fd8a8f83be builder-has-component css-hgfgng\" builder-id=\"builder-15820be824444228ace6b6fd8a8f83be\"><style data-emotion-css=\"1qggkls\"></style><span class=\"builder-text css-1qggkls\"><h3>I'm a paragraph from Builder.io!</h3></span></div><style data-emotion-css=\"q80dxn\"></style><div class=\"builder-block builder-09d46f33071a4caaa7417383ac0ca6e9 builder-has-component css-q80dxn\" builder-id=\"builder-09d46f33071a4caaa7417383ac0ca6e9\"><style data-emotion-css=\"1840m1q\"></style><div class=\"builder-columns css-1840m1q\"><style data-emotion-css=\"2keume\"></style><div class=\"builder-column css-2keume\"><div class=\"builder-blocks builder-blocks-child css-h47494\" builder-type=\"blocks\"><style data-emotion-css=\"dichlt\"></style><span class=\"builder-block builder-314766e257534dc1be477c49a79e1674 builder-has-component css-dichlt\" builder-id=\"builder-314766e257534dc1be477c49a79e1674\">I&#x27;m a button from Builder</span></div></div><style data-emotion-css=\"bst442\"></style><div class=\"builder-column css-bst442\"><div class=\"builder-blocks builder-blocks-child css-h47494\" builder-type=\"blocks\"><style data-emotion-css=\"1xp67e9\"></style><div class=\"builder-block builder-19a69fd2137a41339610cedad5dadf91 css-1xp67e9\" builder-id=\"builder-19a69fd2137a41339610cedad5dadf91\"><picture><source srcSet=\"https://cdn.builder.io/api/v1/image/assets%2Fb5760280b2464ac990288c03c4b8b1bc%2F7d8ad6b7a9b64e75ac112efc0ad685f4?format=webp&amp;width=100 100w, https://cdn.builder.io/api/v1/image/assets%2Fb5760280b2464ac990288c03c4b8b1bc%2F7d8ad6b7a9b64e75ac112efc0ad685f4?format=webp&amp;width=200 200w, https://cdn.builder.io/api/v1/image/assets%2Fb5760280b2464ac990288c03c4b8b1bc%2F7d8ad6b7a9b64e75ac112efc0ad685f4?format=webp&amp;width=400 400w, https://cdn.builder.io/api/v1/image/assets%2Fb5760280b2464ac990288c03c4b8b1bc%2F7d8ad6b7a9b64e75ac112efc0ad685f4?format=webp&amp;width=800 800w, https://cdn.builder.io/api/v1/image/assets%2Fb5760280b2464ac990288c03c4b8b1bc%2F7d8ad6b7a9b64e75ac112efc0ad685f4?format=webp&amp;width=1200 1200w, https://cdn.builder.io/api/v1/image/assets%2Fb5760280b2464ac990288c03c4b8b1bc%2F7d8ad6b7a9b64e75ac112efc0ad685f4?format=webp&amp;width=1600 1600w, https://cdn.builder.io/api/v1/image/assets%2Fb5760280b2464ac990288c03c4b8b1bc%2F7d8ad6b7a9b64e75ac112efc0ad685f4?format=webp&amp;width=2000 2000w, https://cdn.builder.io/api/v1/image/assets%2Fb5760280b2464ac990288c03c4b8b1bc%2F7d8ad6b7a9b64e75ac112efc0ad685f4\" type=\"image/webp\"/><style data-emotion-css=\"12153wi\"></style><img role=\"presentation\" loading=\"lazy\" class=\"builder-image css-12153wi\" src=\"https://cdn.builder.io/api/v1/image/assets%2Fb5760280b2464ac990288c03c4b8b1bc%2F7d8ad6b7a9b64e75ac112efc0ad685f4\" srcSet=\"https://cdn.builder.io/api/v1/image/assets%2Fb5760280b2464ac990288c03c4b8b1bc%2F7d8ad6b7a9b64e75ac112efc0ad685f4?width=100 100w, https://cdn.builder.io/api/v1/image/assets%2Fb5760280b2464ac990288c03c4b8b1bc%2F7d8ad6b7a9b64e75ac112efc0ad685f4?width=200 200w, https://cdn.builder.io/api/v1/image/assets%2Fb5760280b2464ac990288c03c4b8b1bc%2F7d8ad6b7a9b64e75ac112efc0ad685f4?width=400 400w, https://cdn.builder.io/api/v1/image/assets%2Fb5760280b2464ac990288c03c4b8b1bc%2F7d8ad6b7a9b64e75ac112efc0ad685f4?width=800 800w, https://cdn.builder.io/api/v1/image/assets%2Fb5760280b2464ac990288c03c4b8b1bc%2F7d8ad6b7a9b64e75ac112efc0ad685f4?width=1200 1200w, https://cdn.builder.io/api/v1/image/assets%2Fb5760280b2464ac990288c03c4b8b1bc%2F7d8ad6b7a9b64e75ac112efc0ad685f4?width=1600 1600w, https://cdn.builder.io/api/v1/image/assets%2Fb5760280b2464ac990288c03c4b8b1bc%2F7d8ad6b7a9b64e75ac112efc0ad685f4?width=2000 2000w, https://cdn.builder.io/api/v1/image/assets%2Fb5760280b2464ac990288c03c4b8b1bc%2F7d8ad6b7a9b64e75ac112efc0ad685f4\" sizes=\"100vw\"/></picture><style data-emotion-css=\"1aa8xmo\"></style><div class=\"builder-image-sizer css-1aa8xmo\"> </div></div><style data-emotion-css=\"qguwqq\"></style><div class=\"builder-block builder-94d4c3fc1db44fcaa5886916db94821d builder-has-component css-qguwqq\" builder-id=\"builder-94d4c3fc1db44fcaa5886916db94821d\"><span class=\"builder-text css-1qggkls\"><p>The image above me is from Builder!</p><p><br></p></span></div></div></div></div></div><style data-emotion-css=\"1mvsfya\"></style><img src=\"https://cdn.builder.io/api/v1/pixel?apiKey=b5760280b2464ac990288c03c4b8b1bc\" role=\"presentation\" width=\"0\" height=\"0\" class=\"builder-block builder-pixel-uv14r32jplb css-1mvsfya\" builder-id=\"builder-pixel-uv14r32jplb\"/></div></div></div></div></builder-component>\n<script async src=\"https://cdn.builder.io/js/webcomponents\"></script>",
    "animations": [
      {
        "trigger": "scrollInView",
        "animation": "fadeInUp",
        "steps": [
          {
            "id": "468d51e36f704cd29941c48be82cd36d",
            "isStartState": false,
            "styles": {
              "opacity": "0",
              "transform": "translate3d(0, 20px, 0)"
            },
            "delay": 0
          },
          {
            "id": "070b1bb2f32048c5ba8fab3ba54f6b80",
            "isStartState": false,
            "styles": {
              "opacity": "1",
              "transform": "none"
            },
            "delay": 0
          }
        ],
        "delay": 0,
        "duration": 0.5,
        "easing": "cubic-bezier(.37,.01,0,.98)",
        "repeat": false,
        "thresholdPercent": 0,
        "elementId": "builder-09d46f33071a4caaa7417383ac0ca6e9",
        "id": "builder-09d46f33071a4caaa7417383ac0ca6e9"
      },
      {
        "trigger": "scrollInView",
        "animation": "fadeInUp",
        "steps": [
          {
            "id": "468d51e36f704cd29941c48be82cd36d",
            "isStartState": false,
            "styles": {
              "opacity": "0",
              "transform": "translate3d(0, 20px, 0)"
            },
            "delay": 0
          },
          {
            "id": "070b1bb2f32048c5ba8fab3ba54f6b80",
            "isStartState": false,
            "styles": {
              "opacity": "1",
              "transform": "none"
            },
            "delay": 0
          }
        ],
        "delay": 0,
        "duration": 0.5,
        "easing": "cubic-bezier(.37,.01,0,.98)",
        "repeat": false,
        "thresholdPercent": 0,
        "elementId": "builder-09d46f33071a4caaa7417383ac0ca6e9",
        "id": "builder-09d46f33071a4caaa7417383ac0ca6e9"
      }
    ]
  },
  "id": "e18ae8ea06cd41a6a69f4d178de4dc1c",
  "lastUpdatedBy": "9EsPg4I95mcHGVqloFHcEqq2dop2",
  "meta": {
    "hasLinks": false,
    "kind": "page",
    "lastPreviewUrl": "http://localhost:3000/homepage?builder.space=b5760280b2464ac990288c03c4b8b1bc&builder.cachebust=true&builder.preview=page&builder.noCache=true&__builder_editing__=true&builder.overrides.page=e18ae8ea06cd41a6a69f4d178de4dc1c&builder.overrides.e18ae8ea06cd41a6a69f4d178de4dc1c=e18ae8ea06cd41a6a69f4d178de4dc1c&builder.overrides.page:/homepage=e18ae8ea06cd41a6a69f4d178de4dc1c"
  },
  "modelId": "7f9f4de4804a43cc9e2b1c763c5febe5",
  "name": "Homepage",
  "published": "published",
  "query": [
    {
      "@type": "@builder.io/core:Query",
      "operator": "is",
      "property": "urlPath",
      "value": "/homepage"
    }
  ],
  "testRatio": 1,
  "lastUpdated": 1667057439580,
  "firstPublished": 1667057439579,
  "rev": "w7gjtbab0p8"
}
```

Lets see how Astro handles this data, by passing the response down to our page:

```tsx
<Layout title="Welcome to Astro Builder">
  <h1>home page</h1>
  {pageData.html}
</Layout>
```

However, just passing that variable into our Astro component yields a not so nice output:

![Home page with HTML string](/images/builder-astro/blobed-html.png)

It’s basically rendering everything as a string. Let’s see if we can work around this…

Lucky for us, Astro has a way to deal with raw string HTML with the [`set:html` template directive](https://docs.astro.build/en/reference/directives-reference/#sethtml). Let’s change our code a bit to use it:

```tsx
<Layout title="Welcome to Astro Builder">
  <h1>home page</h1>
  <main set:html={pageData.html}></main>
</Layout>
```

Now when we render the page, this is the result:

![Home page with web component content](/images/builder-astro/content-back.png)

However, after looking at the output of the app build (once again running `npm run build` and then `npm run preview` ), we can see it’s still an underlying web component that needs both JS and a client side network request to work:

![Shot of HTML with web component script tag](/images/builder-astro/html-document.png)

And of course, if we disable JS, we end up with a slightly better output than before, but mostly and empty page:

![With Disabled JS](/images/builder-astro/disabled-js-wc.png)

We did get that paragraph from Builder though…

So what can we do?

1. Try and use the `content-api`
2. Try and use `qwik-api`
3. Use `BuilderComponent` with a component from the SDK.

Let’s have a look at them.

### Content API

If we go ahead and query the content API with our credentials, just from the look of the response (partial output below) we can see that in order for us to use the `data` property, we’d have to parse the response and create some sort of rendering function to help us.

```json
{
  "results": [
    {
      "createdBy": "9EsPg4I95mcHGVqloFHcEqq2dop2",
      "createdDate": 1667036699251,
      "data": {
        "inputs": [

        ],
        "themeId": false,
        "title": "Homepage",
        "blocks": [
          {
            "@type": "@builder.io/sdk:Element",
            "@version": 2,
            "id": "builder-15820be824444228ace6b6fd8a8f83be",
            "component": {
              "name": "Text",
              "options": {
                "text": "<h3>I'm a paragraph from Builder.io!</h3>"
              }
            },
            "responsiveStyles": {
              "large": {
                "display": "flex",
                "flexDirection": "column",
                "position": "relative",
                "flexShrink": "0",
                "boxSizing": "border-box",
                "marginTop": "20px",
                "lineHeight": "normal",
                "height": "auto"
              }
            }
          },
			  // ...
			]
		}
	]
}
```

### Qwik API

Qwik is one of Builder’s Open Source projects. It is a new kind of frontend framework which is powered by resumeability. (for a more in depth look at Qwik [read this](https://www.hamatoyogi.dev/blog/qwik-next-big-thing)). We can query the Qwik API with a cURL request as such:

```
curl --request GET \
  --url 'https://cdn.builder.io/api/v1/qwik/page?url=http%3A%2F%2Flocalhost%3A3000%2Fhomepage&apiKey=b5760280b2464ac990288c03c4b8b1bc&page=%2Fhomepage&limit=1'
```

The response also has a similar response with a `data` property and a `blocks` property nested inside. However, there is also an `html` property.

Let’s try and use that in our Astro code:

```tsx
// src/pages/homepage.astro
---
import Layout from '../layouts/Layout.astro';

const apiKey = import.meta.env.BUILDER_API_KEY;

const handleError = (err: any) => {
  console.log(err);
  // The requested Builder content could not be found.
  if (err.response.status === 404) {
    return { data: null };
  }
  throw err;
};

const encodedUrl = encodeURIComponent('/homepage');

const qwikPageData = await fetch(
  `https://cdn.builder.io/api/v1/qwik/page?apiKey=${apiKey}&url=${encodedUrl}`
)
  .then((res) => res.json())
  .catch(handleError);
---

<Layout title='Welcome to Astro Builder'>
  <h1>home page</h1>
  <main set:html={qwikPageData.html}></main>
</Layout>
```

Now we’ll check how the build output looks like by once again running `npm run build` followed by `npm run preview`.

Lo and behold! We have managed to get all of our content static:

![Static content](/images/builder-astro/full-content.png)

And again, we can verify this by disabling JavaScript and reloading the page. Trust me, it works 🙂

### SDK Builder Component

For this, we need to decide on what framework we want our component in, we’re going to use `@builder.io/react` .

Now, in order for this to work in Astro, we need to take a few steps:

1. [Add React to astro](https://docs.astro.build/en/guides/integrations-guide/react/) - run `npx astro add react` and follow the propmpts.
2. Define the Builder / React component:

```tsx
// src/components/ReactBuilder.tsx

import { BuilderComponent } from '@builder.io/react';

export const BuilderReact = ({ builderJson }: { builderJson: any }) => {
  return (
    <>
      <BuilderComponent model="page" content={builderJson} />
    </>
  );
};
```

1. Connect to our data:

```tsx
// src/pages/homepage.astro

import { BuilderReact } from '../components/ReactBuilder';
import { builder } from '@builder.io/react';

const apiKey = import.meta.env.BUILDER_API_KEY;

builder.init(apiKey);

const builderJson = await builder.get('page', { url: '/homepage' }).promise();

<Layout title="Welcome to Astro Builder">
  <h1>home page</h1>
  <BuilderReact builderJson={builderJson} />
</Layout>;
```

And voila!

![Borken React Builder Component Page](/images/builder-astro/broken-builder-react.png)

Our page is broken… 🤦🏽‍♂️

We got our content, but we don’t have our CSS. This is due to Astro’s static nature. The component gets loaded with data from the server, but has no way to hydrate itself. Marking the React component with Astro’s `client` directive is not going to do the trick (trust me, I’ve tried 😉) as we’d need to get our data from Builder on the client.

Let’s try and fix this by moving all of the data fetching into the component itself by following the [React example in Builder’s doc site](https://www.builder.io/c/docs/integrating-builder-pages):

```tsx
// src/components/ReactBuilder.tsx

import { useEffect, useState } from 'react';
import { BuilderComponent, builder, useIsPreviewing } from '@builder.io/react';

// NOTE: now we need to expose the API key to the client.
// See: https://vitejs.dev/guide/env-and-mode.html#env-files
const apiKey = import.meta.env.VITE_BUILDER_API_KEY;

// For React Builder
builder.init(apiKey);

// set whether you're using the Visual Editor,
// whether there are changes,
// and render the content if found
export function BuilderReact() {
  const isPreviewingInBuilder = useIsPreviewing();
  const [notFound, setNotFound] = useState(false);
  const [content, setContent] = useState(null);

  // get the page content from Builder
  useEffect(() => {
    async function fetchContent() {
      const content = await builder
        .get('page', {
          url: window.location.pathname,
        })
        .promise();

      setContent(content);
      setNotFound(!content);
    }
    fetchContent();
  }, [window.location.pathname]);

  return (
    <>
      <head>
        <title>{content?.data.title}</title>
      </head>
      {/* Render the Builder page */}
      <BuilderComponent model="page" content={content} />
    </>
  );
}
```

And that breaks our app…🙄

Again looking at the error message in our terminal we get the most annoying message in all of the full-stack frameworks:

```
window is not defined
```

Trying different directives like `cilent:visable`, `client:idle`, and `client:media` don’t do much to that error. However, when I tried `client:only='react'` the terminal message vanished, and there’s a glimpse of hope, but to no avail 😔  - we don’t see the content…

At this point I have given up on this approach, as this might spiral into a whole other post 😅.

## Conclusion

Builder's Visual CMS is a game changer for developers, in my opinion. It has the power to save you time, money, and a whole lot of headaches. With Astro being such a joy to use, it was interesting to see what another joyful and productive can be tied together with this stack. I know for one that this tool is definitely one that I'd reach for as soon as someone says the word "blog" or "hey, can we change the title in the home page hero section?".
