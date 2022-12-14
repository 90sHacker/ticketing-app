import axios from "axios";

export default ({ req }) => {
  if(typeof window === 'undefined') {
    //server environment
    return axios.create({
      baseURL: 'http://ingress-nginx-controller.ingress-nginx.svc.cluster.local',
      headers: req.headers
    });
  } else {
    //browser environment
    return axios.create({
      baseURL: '/'
    })
  }
}