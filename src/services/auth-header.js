import tokenService from "./token.service";

export default function authHeader() {
  const token = tokenService.getLocalToken();

  if (token && token.accessToken) {
    return { Authorization: "Bearer " + token.accessToken };
  }

  return {};
}
