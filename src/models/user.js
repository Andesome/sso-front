import { postLogin, postRegister } from '@/services/api';
import { SUCCESS_STATUS } from '@/constant/config';

export default {
  namespace: 'user',

  state: {
    token: '',
    userInfo: {},
    registerStatus: false,
  },

  effects: {
    *register({ payload, success, error }, { call, put }) {
      const rsp = yield call(postRegister, payload);
      if (rsp.status >> 0 === 200 && rsp.code === SUCCESS_STATUS) {
        success && success(rsp)
      } else {
        error && error(rsp);
      }
      yield put({
        type: 'addUser',
        payload: payload,
      });
    },
    *login({ payload, success, error }, { call, put }) {
      const rsp = yield call(postLogin, payload);
      if (rsp.status >> 0 === 200 && rsp.code === SUCCESS_STATUS ){
        success && success(rsp)
      }else{
        error && error(rsp);
      }
      const token = rsp.headers.authorization;
      yield put({
        type: 'saveUser',
        payload: {
          token,
          userInfo: rsp.data,
        },
      });
    },
  },

  reducers: {
    addUser(state, action) {
      return {
        ...state,
        registerStatus: true,
      };
    },
    saveUser(state, action) {
      return {
        ...state,
        ...action.payload,
      };
    },
  },
};
