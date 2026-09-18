import { Helmet } from 'react-helmet-async';
import FareCalculator from '../components/FareCalculator';

function Home() {
  return (
    <>
      <Helmet>
        <title>Get an Instant Fare Quote — Brizzy Ride & Explore</title>
        <meta name="description" content="Enter your pickup and destination for an instant Brisbane airport transfer quote." />
      </Helmet>
      <FareCalculator />
    </>
  );
}

export default Home;