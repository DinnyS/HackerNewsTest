import React from 'react'
import '../../styles/styles.css'

// Title (link to story details page) = click to go to details page
// Author = by
// Score = score
// Extend Url = url
// Top-level comments = kids (Limit 5)

export async function getServerSideProps(context) {

  const { id } = context.params

  // fetch story detail by using id form index page
  const storyDetailResponse = await fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`)

  // not found data throw error
  if(!storyDetailResponse.ok){
    throw new Error('Fail to fetch story detail data.')
  }

  const storyDetails = await storyDetailResponse.json()

  let topComments = []
  if (storyDetails.kids && storyDetails.kids.length > 0) {
    const topComment = storyDetails.kids.slice(0, 5)
    console.log("topComment : " + topComment)

    const topCommentDatas = topComment.map((kid) =>
      fetch(`https://hacker-news.firebaseio.com/v0/item/${kid}.json`).then(res => res.json())
    )
    topComments = await Promise.all(topCommentDatas)
  }

  return {
    props: {
      story: storyDetails,
      comments: topComments
    }
  }
}

export default function StoryPage({ story, comments }) {
  return (
    <>
      <div className='background-detail'>
        <div className='story-detail'>
          <h1 className='topic-detail-header'>{story.title}</h1>
          <hr/>
          <p className='story-detail-text'>Author: <span className='story-detail-text-show'>{story.by}</span></p>
          <p className='story-detail-text'>Score: <span className='story-detail-text-show'>{story.score}</span></p>
          <p className='story-detail-text'>URL: <span className='story-detail-text-show'><a className="story-link" href={story.url} target="_blank" rel="noopener noreferrer">{story.url}</a></span></p>
          <hr/>
          <h2 className='story-detail-text'>Top-level comments</h2>
          {comments.length === 0 && <p>No comments</p>}
          <ul>
            {comments.map((comment) => (
              <li key={comment.id} dangerouslySetInnerHTML={{ __html: comment.text || '' }}></li>
            ))}
          </ul>
        </div>
      </div>
    </>
  )
}
