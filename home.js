function Home() {
  return (
    <div>
    <Header />
      <h1 className="text-xl font-bold text-black text-start m-2">Blog Posts</h1>
      <section className="animate__animated animate__fadeIn bg-white shadow m-4 p-4 hover:scale-105 transition duration-300 rounded">
        <div className="container flex flex-col">
          <p className="text-gray-800 underline font-bold font-serif text-lg text-start text-wrap">
            The Significance of Differential Equations in Robotic Engineering
          </p>
          <p className="text-gray-600 font-sans text-sm text-wrap text-start">
            The significance of differential equations is well impactful in multiple regions of science, including robotics.
          </p>
          <a 
          className="flex text-[13px] italic text-blue-800 hover:underline justify-self-end transition w-20 hover:text-purple-600 text-end items-end"
          onClick={()=>{
            window.location.hash = "#blog-post"
          }} 
          href="#blog-post">
            Read more
          </a>
        </div>
      </section>
    </div>
  );
}
window.location.hash = "#home"