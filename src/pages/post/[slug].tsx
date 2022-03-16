import {GetStaticPaths, GetStaticProps} from 'next';
import {RichText} from 'prismic-dom';
import {FiCalendar, FiUser, FiClock} from "react-icons/fi";
import {format} from "date-fns";

import {getPrismicClient} from '../../services/prismic';
import Header from "../../components/Header";

import commonStyles from '../../styles/common.module.scss';
import styles from './post.module.scss';
import Link from "next/link";

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
  console.log(post.data.content);
  return (
    <>
      <Header/>
      <main className={styles.container}>
        <img src={post.data.banner.url} alt="" className={styles.image}/>
        <div className={styles.content}>
          <h1>{post.data.title}</h1>
          <div className={styles.details}>
            <div className={styles.info}>
              <FiCalendar size={20} color="#BBBBBB"/>
              <p>{post.first_publication_date}</p>
            </div>
            <div className={styles.info}>
              <FiUser size={20} color="#BBBBBB"/>
              <p>{post.data.author}</p>
            </div>
            <div className={styles.info}>
              <FiClock size={20} color="#BBBBBB"/>
              <p>3min</p>
            </div>
          </div>

          {post.data.content.map(post => (
            <>
              <h2>{post.heading}</h2>
              <div
                dangerouslySetInnerHTML={{__html: post.body}}
              />
            </>
          ))}
        </div>
      </main>
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

  const post = {
    first_publication_date: format(new Date(response.first_publication_date), 'dd MMM yyyy'),
    data: {
      title: RichText.asText(response.data.title),
      author: RichText.asText(response.data.author),
      banner: {
        url: response.data.banner.url
      },
      content: response.data.content.map(content => {
        return {
          heading: RichText.asText(content.heading),
          body: RichText.asHtml([...content.body]),
        };
      }),
    },
  };

  return {
    props: {
      post,
    },
    redirect: 60 * 30, // 30 min
  };
};
