import { getProviders, signIn } from "next-auth/react";
function Login({ providers }) {
  return (
    <div className="flex flex-col text-white items-center bg-black min-h-screen justify-center w-full">
      <div className="bg-[#181818] p-10 text-center rounded-lg">
        <img
          className="h-28 mb-5"
          src="https://i.imgur.com/LloW0af.png"
          alt="Spotify Logo"
        />
        <h2 className="font-bold text-2xl p-5">Lucas Webber's Spotify Clone</h2>
        <h2 className=" pb-10">To Continue, Log In with Spotify</h2>

        {Object.values(providers).map((provider) => (
          <div key={provider.name}>
            <button
              className="bg-[#18D860] text-white p-5 rounded-lg"
              onClick={() => signIn(provider.id, { callbackUrl: "/" })}
            >
              Login with {provider.name}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Login;

export async function getServerSideProps() {
  const providers = await getProviders();

  console.log(providers);
  return {
    props: {
      providers,
    },
  };
}
