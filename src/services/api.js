import Request from '@/utils/request';
import { API_URL } from '@/constant/config';

// 注册接口
export async function postRegister(data) {
  return Request(`${API_URL}/register`, {
    method: 'post',
    data,
  });
}

//登录接口
export async function postLogin(data) {
  return Request(`${API_URL}/login`, {
    method: 'post',
    data,
  });
}
