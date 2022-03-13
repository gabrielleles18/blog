import {GetStaticPaths, GetStaticProps} from 'next';
import {RichText} from 'prismic-dom';

import {getPrismicClient} from '../../services/prismic';

import commonStyles from '../../styles/common.module.scss';
import styles from './post.module.scss';
import {format} from "date-fns";
import Header from "../../components/Header";

interface Post {
  first_publication_date: string | null;
  data: {
    title: string;
    banner: {
      url: string;
    };
    author: string;
    content: {
      heading: string;
      body: {
        text: string;
      }[];
    }[];
  };
}

interface PostProps {
  post: Post;
}

export default function Post({post}: PostProps) {
  console.log(post);
  return (
    <>
      <Header/>
    </>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const prismic = getPrismicClient();
  // const posts = await prismic.query(TODO);

  return {
    paths: [],
    fallback: 'blocking',
  };
};

export const getStaticProps: GetStaticProps = async ({params}) => {
  const prismic = getPrismicClient();
  const slug = params.slug;

  const response = await prismic.getByUID('posts', String(slug), {});

  const content = response.data.content;

  const post = {
    slug,
    title: RichText.asText(response.data.title),
    author: RichText.asText(response.data.author),
    subtitle: RichText.asText(response.data.subtitle),
    content: content,
    banner: response.data.banner,
    updatedAt: format(new Date(response.last_publication_date), 'dd MMM yyyy'),
  };

  return {
    props: {
      post,
    },
    redirect: 60 * 30, // 30 min
  };
};
