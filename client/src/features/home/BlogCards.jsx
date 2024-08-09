import { Link } from "react-router-dom";
import { useGetAllBlogsQuery } from "../../state/api/blogApi";

const BlogCards = ({ search }) => {
  const { data: blogs = [], error, isLoading } = useGetAllBlogsQuery();

  // Handle loading state
  if (isLoading) return <p>Loading...</p>;

  // Handle error state
  if (error) return <p>Error: {error.message}</p>;

  const filteredPosts = blogs.data.filter(post =>
    post.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {filteredPosts.map(post => (
        <Link
          to={post._id}
          key={post._id}
          className="p-4 border rounded-lg shadow-md"
        >
          <h2 className="text-xl font-bold mb-2">{post.title}</h2>
          {/* <p>{post.content}</p> */}
        </Link>
      ))}
    </div>
  );
};

export default BlogCards;
