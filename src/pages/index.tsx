import {RichText} from "prismic-dom";
import Prismic from "@prismicio/client";
import {format} from 'date-fns';
import Head from "next/head";
import Link from 'next/link';
import { FiUser, FiCalendar } from 'react-icons/fi';
import {getPrismicClient} from '../services/prismic';

import commonStyles from '../styles/common.module.scss';
import styles from './home.module.scss';
import Header from "../components/Header";

interface Post {
  uid?: string;
  first_publication_date: string | null;
  data: {
    title: string;
    subtitle: string;
    author: string;
  };
}

interface PostPagination {
  next_page: string;
  results: Post[];
}

interface HomeProps {
  postsPagination: PostPagination;
}

export default function Home({posts}: HomeProps) {
  console.log(posts);
  return (
    <>
      <Head>
        <title> Spacetraveling </title>
      </Head>

      <Header/>

      <main className={styles.container}>
        {posts.map(post => (
          <Link href={`/post/${post.slug}`}>
            <a key={post.slug}>
              <h1 className={styles.title}>{post.title}</h1>
              <h4 className={styles.subtitle}>{post.subtitle}</h4>
              <div className={styles.dateAuthor}>
                <div className={commonStyles.info}>
                  <FiCalendar size={20} color="#BBBBBB" />
                  <p>{post.updatedAt}</p>
                </div>
                <div className={commonStyles.info}>
                  <FiUser size={20} color="#BBBBBB" />
                  <p>{post.author}</p>
                </div>
              </div>
            </a>
          </Link>
        ))}
      </main>
    </>
  );
}

export const getStaticProps = async () => {
  const prismic = getPrismicClient();
  const postsResponse = await prismic.query([
      Prismic.predicates.at('document.type', 'posts')
    ],
    {
      fetch: ['posts.title', 'posts.subtitle', 'posts.author'],
      pageSize: 5,
    });

  const posts = postsResponse.results.map(post => {
    return {
      slug: post.uid,
      title: RichText.asText(post.data.title),
      author: RichText.asText(post.data.author),
      subtitle: RichText.asText(post.data.subtitle),
      updatedAt: format(new Date(post.last_publication_date), 'dd MMM yyyy'),
    }
  })

  return {
    props: {posts}
  }
};
