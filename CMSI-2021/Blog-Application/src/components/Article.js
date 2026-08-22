export default function Article({ article, deleter }) {
  return (
    <article>
      {!article ? (
        <p>No article selected</p>
      ) : (
        <section>
          <h2>{article.title}</h2>
          <p className="date">{`Posted: ${article.date.toDate()}`}</p>
          <p className="body">{article.body}</p>
          <button
            onClick={() => {
              deleter(article.id);
            }}
          >
            Delete
          </button>
        </section>
      )}
    </article>
  );
}
