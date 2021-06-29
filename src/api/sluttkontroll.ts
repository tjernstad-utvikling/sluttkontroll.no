import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

let isRefreshing = false;

let url;
if (__DEV__) {
  url = "https://cc5f46dcc340.ngrok.io/api";
} else {
  url = "https://api.sluttkontroll.no/api";
}

export const apiUrl = url;

const instance = axios.create({
  baseURL: url,
});

instance.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (err) => {
    return Promise.reject(err);
  }
);

instance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    // Return any error which is not due to authentication back to the calling service
    if (error.response.status === 401) {
      // Logout user if token refresh didn't work or user is disabled

      if (error.config.url === "/token/refresh") {
        RootNavigation.navigate("Logg ut", {});
        error.config = null;
        return Promise.reject(error);
      } else {
        if (!isRefreshing) {
          isRefreshing = true;
          // Try request again with new token
          try {
            const { token } = await refreshLoginToken();
            // New request with new token
            const config = error.config;
            config.headers.Authorization = `Bearer ${token}`;
            return new Promise((resolve, reject) => {
              axios
                .request(config)
                .then((response) => {
                  isRefreshing = false;
                  resolve(response);
                })
                .catch((err) => {
                  reject(err);
                });
            });
          } catch (Error) {
            Promise.reject(Error);
          }
        }
      }
    }
    return Promise.reject(error);
  }
);

export default instance;

const refreshLoginToken = async () => {
  try {
    const refresh_token = await AsyncStorage.getItem("refresh_token");
    const response = await instance.post("/token/refresh", {
      refresh_token,
    });

    await AsyncStorage.setItem("token", response.data.token);
    await AsyncStorage.setItem("refresh_token", response.data.refresh_token);

    return {
      status: true,
      token: response.data.token,
      refresh_token: response.data.refresh_token,
    };
  } catch (error) {
    return {
      status: false,
      code: error.response.status,
    };
  }
};
