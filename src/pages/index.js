import Link from "next/link";
import "../styles/styles.css";
import HeaderStory from "../components/headerStory";
import React from "react";

// Title (link to story details page) = click to go to details page
// Author = by
// Score = score
// Number of comments = kid.json

export async function getStaticProps() {

  try {
    const res = await fetch(
      "https://hacker-news.firebaseio.com/v0/topstories.json"
    );
    if (!res.ok) {
      throw new Error("Fail to fetch story Data.");
    }

    const allStoryId = await res.json();
    const tenStoryIds = allStoryId.slice(0, 10);

    const storyDetails = await Promise.all(
      tenStoryIds.map((id) =>
        fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`).then(
          (res) => res.json()
        )
      )
    );

    return {
      props: {
        stories: storyDetails,
      },
      revalidate: 60,
    };
  } catch (error) {
    console.log("Error fetch story");
    return {
      props: {
        stories: [],
        error: "Unable to load top stories.",
      },
      revalidate: 60,
    };
  }
}

export default function Page({ stories }) {
  return (
    <>
      <HeaderStory />
      <div className="background-detail">
        <ul className="story-box">
          {stories.map((story) => (
            <li className="story" key={story.id}>
              <p className="story-text">
                <Link className="story-link" href={`/story/${story.id}`}>
                  Title: {story.title}
                </Link>
              </p>
              <p className="story-text">Author: {story.by}</p>
              <p className="story-text">Score: {story.score}</p>
              <p className="story-text">
                Number of comments: {story.kids?.length || 0}
              </p>
              <hr />
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
