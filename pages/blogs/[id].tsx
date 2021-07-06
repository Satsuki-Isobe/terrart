import Layout from '../../components/layout'
import Head from 'next/head'
import Date from '../../components/date'
import { GetStaticProps, GetStaticPaths } from 'next'
import utilStyles from '../../styles/utils.module.css'
import { blogs } from '../../lib/blogs'
import cheerio from 'cheerio';
import hljs from 'highlight.js'
import 'highlight.js/styles/night-owl.css';

export default function Post({
  blog, highlightedBody
}: {
  blog: {
    id: string,
    createdAt: any,
    updatedAt: any,
    publishedAt: any,
    revisedAt: any,
    title: string,
    subtitle: string,
    thumbnail: {
      url: string,
      height: number,
      width: number
    },
    category?: [],
    content: string
  }
}) {
  console.log(blog)
  const UpperTitle = blog.id.charAt(0).toUpperCase() + blog.id.slice(1);

  return (
    <Layout>
      <Head>
        <title>{blog.title}</title>
      </Head>
      <article>
        <button onClick={() => getSortedPostsData()}></button>
        <h1 className={utilStyles.headingXl}>{blog.title}</h1>
        <div className={utilStyles.lightText}>
          {blog.createdAt}
        </div>
        <div dangerouslySetInnerHTML={{ __html: highlightedBody }} />
      </article>
    </Layout>
  )
}

// 記事のパスを作成：[id]に代入される
export const getStaticPaths: GetStaticPaths = async () => {
  const data = await blogs.get({ endpoint: "blog" });
  const paths = data.contents.map(content => `/blogs/${content.id}`)
  console.log(paths)
  return {
    paths,
    fallback: false
  }
}

// 
export const getStaticProps: GetStaticProps = async ({ params }) => {
  const id = params.id
  const data = await blogs.get({
    endpoint: "blog",
    contentId: id
  });

  const $ = cheerio.load(data.content)

  $('pre code').each((_, elm) => {
    const result = hljs.highlightAuto($(elm).text())
    $(elm).html(result.value)
    $(elm).addClass('hljs')
  })


  return {
    props: {
      blog: data,
      highlightedBody: $.html()
    }
  }
}
