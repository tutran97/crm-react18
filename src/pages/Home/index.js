import {
  faFileInvoiceDollar,
  faMoneyCheckDollar,
  faUserAstronaut
} from '@fortawesome/free-solid-svg-icons';
import { StatsCard } from '../../components';

const Home = () => (
  <>
    <div className="flex flex-wrap -mx-3">
      <StatsCard
        cardTitle="Today's Money"
        statNumber="1000$"
        statPrecent={40}
        icon={faMoneyCheckDollar}
      />
      <StatsCard
        cardTitle="Today's Users"
        statNumber="2,300"
        statPrecent={20}
        icon={faUserAstronaut}
      />
      <StatsCard
        cardTitle="Today's Orders"
        statNumber="1,500"
        statPrecent={80}
        icon={faFileInvoiceDollar}
      />
    </div>
  </>
);

export default Home;
