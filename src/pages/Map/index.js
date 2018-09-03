import Loadable from 'react-loadable';

export default Loadable({
  loader: () => import(/* webpackChunkName: "Map" */ './Map'),
  loading: () => null
});
