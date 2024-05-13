import { PostUtils } from "./postUtils";
import { groupService } from "@/services/group.service";
import { grMemberService } from "@/services/group-member.service";
import { deepCopy } from "@/utilities";
import tokenService from "@/services/token.service";
import { groupInviteService } from "@/services/group-invite.service";
import { toastAlert } from "@/utilities/toastAlert";
import { POST_TYPE } from "@/constants";
const user = tokenService.getUser();

const defaultState = () => {
  return {
    info: null,
    post: {
      data: [],
      pageSize: 10,
      endCursor: null,
      total: 0,
      hasNextPage: true,
    },
    media: {
      data: [],
      pageSize: 12,
      pageNumber: 0,
      total: 0,
      isFetched: false,
    },
    member: {
      data: [],
      hasNextPage: true,
      total: 0,
      endCursor: null,
      pageSize: 20,
    },
    memberSearch: {
      data: [],
      hasNextPage: true,
      total: 0,
      endCursor: null,
      pageSize: 20,
      searchString: null,
    },
    memberInvite: {
      data: [],
      hasNextPage: true,
      total: 0,
      endCursor: null,
      pageSize: 20,
    },
    memberInviteSearch: {
      data: [],
      hasNextPage: true,
      total: 0,
      endCursor: null,
      pageSize: 20,
      searchString: null,
    },
  };
};

export const group = {
  namespaced: true,
  state: defaultState,
  actions: {
    async initGroupStore({ dispatch, state }, payLoad) {
      await dispatch("getGroupInfo", payLoad);
      await dispatch("getMemberCurrent", payLoad);

      // Nhóm riêng tư và không phải thàn viên
      if (!state.info.isPublic && !state.info.currentMember) {
        return;
      }
      await dispatch("getMedia");
      await dispatch("getMember");
      await dispatch("getInviteCurrent", payLoad);
      await dispatch(
        "groupPost/initStore",
        {
          groupId: payLoad,
          postType: POST_TYPE.GROUP_POST,
        },
        { root: true }
      );

      await dispatch("groupPost/getPost", null, { root: true });

      if (state.info.currentMember?.isAdmin) {
        await dispatch("getInviteMember", {
          searchString: null,
        });
      }
    },

    async getGroupInfo({ commit }, payLoad) {
      const groupRes = await groupService.getById(payLoad);
      commit("getGroupDataSuccess", groupRes.data);
    },

    async getMemberCurrent({ commit }, payLoad) {
      const userId = tokenService.getUser().id;
      try {
        const memberCurrentRes = await grMemberService.getByGrIdAndUserId(
          payLoad,
          userId
        );
        commit("getMemberCurrentSuccess", memberCurrentRes);
      } catch (err) {
        if (err.status != 404) {
          console.error(err);
          toastAlert.error("Có lỗi khi tải dữ liệu user");
        }
      }
    },

    async getInviteCurrent({ commit }, payLoad) {
      const userId = tokenService.getUser().id;
      try {
        const inviteCurrentRes = await groupInviteService.getByUIDandGrID(
          payLoad,
          userId
        );
        commit("getInviteCurrentSuccess", inviteCurrentRes);
      } catch (err) {
        if (err.status != 404) {
          console.error(err);
          toastAlert.error("Có lỗi khi tải dữ liệu user");
        }
      }
    },

    async getPost({ commit, state, dispatch }) {
      if (!state.post.hasNextPage) return;
      try {
        const postRes = await PostUtils.getPostCursorWithDependent({
          type: POST_TYPE.GROUP_POST,
          pageSize: state.post.pageSize,
          groupId: state.info.id,
          cursor: state.post.endCursor,
        });

        commit("getPostSuccess", postRes);
        dispatch("groupPost/setPosts", postRes.data, { root: true });
      } catch (err) {
        console.error(err);
        toastAlert.error("Có lỗi khi tải bài viết");
      }
    },

    async getMedia({ commit, state }) {
      try {
        const mediaRes = await groupService.getMedia(state.info.id, {
          pageSize: state.media.pageSize,
          pageNumber: state.media.pageNumber + 1,
        });
        commit("getMediaSuccess", mediaRes);
      } catch (err) {
        console.error(err);
        toastAlert.error("Có lỗi khi tải hình ảnh");
      }
    },

    async getMember({ commit, state }) {
      if (!state.member.hasNextPage) return;

      try {
        const cursorRes = await grMemberService.getCursor({
          pageSize: state.member.pageSize,
          groupId: state.info.id,
          cursor: state.member.endCursor,
        });

        commit("getMemberSuccess", cursorRes);
      } catch (err) {
        console.error(err);
        toastAlert.error("Có lỗi khi lấy dữ liệu thành viên");
      }
    },

    async updateGroupInfo({ commit, state }, payLoad) {
      try {
        const updateRes = await groupService.update(state.info.id, payLoad);
        commit("updateGroupInfoSuccess", updateRes);
      } catch (err) {
        if (err.status != 501) {
          console.error(err);
          toastAlert.error("Có lỗi khi cập nhật nhóm");
        }
      }
    },

    async getSearchMember({ commit, state }, payLoad) {
      if (state.memberSearch.searchString != payLoad.searchString) {
        commit("resetSearchMember");
      }

      if (payLoad.searchString == "" || !state.memberSearch.hasNextPage) {
        return;
      }

      const res = await grMemberService.getCursor({
        pageSize: state.memberSearch.pageSize,
        searchString: payLoad.searchString,
        groupId: state.info.id,
        cursor: state.memberSearch.endCursor,
      });

      commit("getSearchMemberSuccess", {
        ...res,
        searchString: payLoad.searchString,
      });
    },

    async getInviteMember({ commit, state }) {
      if (!state.memberInvite.hasNextPage) return;

      try {
        const inviteRes = await groupInviteService.getCursor({
          groupId: state.info.id,
          pageSize: state.memberInvite.pageSize,
          cursor: state.memberInvite.endCursor,
        });

        commit("getInviteMemberSuccess", inviteRes);
      } catch (err) {
        if (err.status != 404) {
          console.error(err);
          toastAlert.error("Có lỗi khi tải yêu cầu tham gia nhóm");
        }
      }
    },

    async getInviteMemberSearch({ commit, state }, payLoad) {
      if (state.memberInviteSearch.searchString != payLoad.searchString) {
        commit("resetInviteMemberSearch");
      }

      if (payLoad.searchString == "" || !state.memberInviteSearch.hasNextPage)
        return;

      const res = await groupInviteService.getCursor({
        pageSize: state.memberInviteSearch.pageSize,
        searchString: payLoad.searchString,
        groupId: state.info.id,
        cursor: state.memberInviteSearch.endCursor,
      });

      commit("getInviteMemberSearchSuccess", {
        ...res,
        searchString: payLoad.searchString,
      });
    },

    async sendRequestInvite({ commit, state }) {
      try {
        const inviteRes = await groupInviteService.create({
          groupId: state.info.id,
        });

        commit("sentInviteRequest", inviteRes);
      } catch (err) {
        console.error(err);
        toastAlert.error("Có lỗi khi yêu cầu tham gia");
      }
    },

    async cancelRequestInvite({ commit, state }) {
      try {
        await groupInviteService.delete(state.info.currentInvite.id);
        commit("cancelledRequestInvite");
      } catch (err) {
        console.error(err);
        toastAlert.error("Có lỗi khi hủy yêu cầu");
      }
    },

    async acceptInvite({ commit }, payLoad) {
      try {
        const acceptRes = await groupInviteService.accept(payLoad.id);
        if (acceptRes.status == 201) {
          commit("inviteAcceptedAndJoined", {
            inviteId: payLoad.id,
            memberData: acceptRes.data,
          });
        }
      } catch (err) {
        console.error(err);
        toastAlert.error("Có lỗi khi chấp nhận yêu cầu tham gia");
      } finally {
        commit("inviteAcceptedOrRefused", {
          inviteId: payLoad.id,
        });
      }
    },

    async refuseInvite({ commit }, payLoad) {
      try {
        await groupInviteService.delete(payLoad.id);
      } catch (error) {
        console.error(error);
        if (error.status == 404) {
          commit("remo");
        }
        toastAlert.error("Có lỗi khi từ chối yêu cầu");
      } finally {
        commit("inviteAcceptedOrRefused", {
          inviteId: payLoad.id,
        });
      }
    },

    async addAdminRole({ commit }, payLoad) {
      try {
        const addAdminRes = await grMemberService.createAdmin(payLoad.id);
        commit("addedOrRemovedAdminRole", addAdminRes.data);
      } catch (error) {
        console.error(error);
        toastAlert.error("Có lỗi khi chỉ định quản trị viên");
      }
    },

    async removeAdminRole({ commit }, payLoad) {
      try {
        const removeAdminRes = await grMemberService.removeAdmin(payLoad.id);
        commit("addedOrRemovedAdminRole", removeAdminRes.data);
      } catch (error) {
        console.error(error);
        toastAlert.error("Có lỗi khi thu hồi quyền quản trị");
      }
    },

    async deleteGroup({ state }) {
      try {
        await groupService.delete(state.info.id);
      } catch (err) {
        console.error(err);
        toastAlert.error("Có lỗi khi xóa nhóm");
      }
    },

    async leaveGroup({ commit, state }) {
      try {
        await grMemberService.deleteByUidGrId(user.id, state.info.id);
        commit("leaveGroupSuccess");
      } catch (error) {
        console.error(error);
        toastAlert.error("Có lỗi khi rời nhóm");
      }
    },

    resetSearchMember({ commit }) {
      commit("resetSearchMember");
    },

    reset({ commit, dispatch }) {
      dispatch("groupPost/reset", null, { root: true });
      commit("resetState");
    },
  },
  mutations: {
    getGroupDataSuccess(state, payLoad) {
      state.info = payLoad;
    },

    getMemberCurrentSuccess(state, payLoad) {
      state.info.currentMember = payLoad.data;
    },

    getInviteCurrentSuccess(state, payLoad) {
      state.info.currentInvite = payLoad.data;
    },

    getPostSuccess(state, payLoad) {
      state.post.total = payLoad.totalItems;
      state.post.endCursor = payLoad.endCursor;
      state.post.hasNextPage = payLoad.hasNextPage;
    },

    getMediaSuccess(state, payLoad) {
      state.media.total = payLoad.totalItems;
      state.media.data = [...state.media.data, ...payLoad.data];
      state.media.pageNumber++;
      state.media.isFetched = true;
    },

    getMemberSuccess(state, payLoad) {
      state.member.data.push(...payLoad.data);
      state.member.total = payLoad.totalItems;
      state.member.endCursor = payLoad.endCursor;
      state.member.hasNextPage = payLoad.hasNextPage;
    },

    getSearchMemberSuccess(state, payLoad) {
      state.memberSearch.searchString = payLoad.searchString;
      state.memberSearch.endCursor = payLoad.endCursor;
      state.memberSearch.data.push(...payLoad.data);
      state.memberSearch.hasNextPage = payLoad.hasNextPage;
    },

    getInviteMemberSuccess(state, payLoad) {
      state.memberInvite.data.push(...payLoad.data);
      state.memberInvite.total = payLoad.totalItems;
      state.memberInvite.hasNextPage = payLoad.hasNextPage;
      state.memberInvite.endCursor = payLoad.endCursor;
    },

    getInviteMemberSearchSuccess(state, payLoad) {
      state.memberInviteSearch.searchString = payLoad.searchString;
      state.memberInviteSearch.data.push(...payLoad.data);
      state.memberInviteSearch.total = payLoad.totalItems;
      state.memberInviteSearch.hasNextPage = payLoad.hasNextPage;
      state.memberInviteSearch.endCursor = payLoad.endCursor;
    },

    updateGroupInfoSuccess(state, payLoad) {
      state.info = { ...state.info, ...payLoad.data };
    },

    inviteAcceptedAndJoined(state, payLoad) {
      state.memberInvite.data = state.memberInvite.data.filter(
        (x) => x.id != payLoad.inviteId
      );
      state.memberInvite.total--;

      state.member.data.push(payLoad.memberData);
      state.member.total++;
      state.info.totalMember++;
    },

    inviteAcceptedOrRefused(state, payLoad) {
      state.memberInvite.data = state.memberInvite.data.filter(
        (x) => x.id != payLoad.inviteId
      );
      state.memberInvite.total--;
    },

    sentInviteRequest(state, payLoad) {
      state.info.currentInvite = payLoad.data;
    },

    cancelledRequestInvite(state) {
      state.info.currentInvite = null;
    },

    addedOrRemovedAdminRole(state, payLoad) {
      const member = state.member.data.find((x) => x.id == payLoad.id);
      member.isAdmin = payLoad.isAdmin;
    },

    leaveGroupSuccess(state) {
      state.currentMember = null;
    },

    resetSearchMember(state) {
      state.memberSearch.searchString = null;
      state.memberSearch.hasNextPage = true;
      state.memberSearch.data = [];
      state.memberSearch.endCursor = null;
      state.memberSearch.total = 0;
    },

    resetInviteMemberSearch(state) {
      state.memberInviteSearch.searchString = null;
      state.memberInviteSearch.total = 0;
      state.memberInviteSearch.data = [];
      state.memberInviteSearch.hasNextPage = true;
      state.memberInviteSearch.endCursor = null;
    },

    resetState(state) {
      const newState = deepCopy(defaultState());
      Object.assign(state, newState);
    },
  },
  getters: {
    getGroupInfo: (state) => state.info,
    getPostState: (state) => state.post,
    getMediaState: (state) => state.media,
    getSearchMember: (state) => state.memberSearch,
    getInviteMember: (state) => state.memberInvite,
    getInviteMemberCount: (state) => state.memberInvite.total,
    getInviteMemberSearch: (state) => state.memberInviteSearch,
    getMember: (state) => state.member,
    getHeaderMember: (state) => state.member.data.slice(0, 5),
  },
};
