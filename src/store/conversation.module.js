import { conversationService } from "@/services/conversation.service";
import tokenService from "@/services/token.service";
import { toastAlert } from "@/utilities/toastAlert";

export const conversation = {
  namespaced: true,
  state: {
    data: [],
  },
  actions: {
    async getConversationByUserId({ state, dispatch }, payLoad) {
      try {
        const conversationRes = await conversationService.getByUserId(payLoad);
        const checkExist = state.data.find(
          (x) => x.id == conversationRes.data.id
        );
        if (!checkExist) {
          dispatch("getConversationById", conversationRes.data.id);
        } else {
          dispatch("showConversation", conversationRes.data.id);
        }
      } catch (err) {
        console.error(err);
        toastAlert.error("Có lỗi khi tải đoạn chat");
      }
    },
    async getConversationById({ commit, state, dispatch }, payLoad) {
      const checkExist = state.data.find((x) => x.id == payLoad);

      if (!checkExist) {
        try {
          const conversationRes = await conversationService.getById(payLoad);

          commit("getConversationSuccess", conversationRes);

          await dispatch("getMessage", {
            conversationId: conversationRes.data.id,
          });

          await dispatch("getParticipant", {
            conversationId: conversationRes.data.id,
          });
        } catch (err) {
          console.error(err);
          toastAlert.error("Có lỗi khi tải đoạn chat");
        }
      } else {
        dispatch("showConversation", payLoad);
      }
    },
    async getParticipant({ commit, state }, payLoad) {
      const conversation = state.data.find(
        (x) => x.id == payLoad.conversationId
      );
      if (
        conversation &&
        (conversation.participants.pageSize *
          conversation.participants.pageNumber <
          conversation.participants.total ||
          !conversation.participants.isFetched)
      ) {
        try {
          const participantRes = await conversationService.getParticipant(
            payLoad.conversationId,
            {
              pageSize: conversation.participants.pageSize,
              pageNumber: conversation.participants.pageNumber + 1,
            }
          );

          commit("getParticipantSuccess", {
            conversationId: payLoad.conversationId,
            ...participantRes,
          });
        } catch (err) {
          console.error(err);
          toastAlert.error("Có lỗi khi tải thành viên");
        }
      }
    },
    async createConversation({ commit, dispatch }, payLoad) {
      try {
        const createRes = await conversationService.create({
          name: null,
          userIds: payLoad.map((item) => item.id),
        });

        commit("createConversationSuccess", createRes);
        await dispatch("getParticipant", {
          conversationId: createRes.data.id,
        });
      } catch (err) {
        console.error(err);
        toastAlert.error("Có lỗi khi tạo nhóm chat");
      }
    },
    async getMessage({ commit, state }, payLoad) {
      const conversation = state.data.find(
        (x) => x.id == payLoad.conversationId
      );
      if (!conversation) {
        toastAlert.error("Không tìm thấy đoạn chat");
        return;
      }

      if (conversation.messages.hasNextPage) {
        try {
          const messageRes = await conversationService.getMessage(
            payLoad.conversationId,
            {
              pageSize: conversation.messages.pageSize,
              cursor: conversation.messages.endCursor,
            }
          );

          commit("getMessageSuccess", {
            conversationId: payLoad.conversationId,
            ...messageRes,
          });
        } catch (err) {
          console.error(err);
          toastAlert.error("Có lỗi khi tải tin nhắn");
        }
      }
    },
    async sendMessage({ commit }, payLoad) {
      try {
        const sendRes = await conversationService.createMessage(
          payLoad.conversationId,
          {
            content: payLoad.content,
          }
        );

        commit("sendMessageSuccess", {
          conversationId: payLoad.conversationId,
          data: sendRes.data,
        });

        return Promise.resolve(sendRes.data);
      } catch (err) {
        console.error(err);
        toastAlert.error("Có lỗi khi gửi tin nhắn");
      }
    },
    removeConversation({ commit }, payLoad) {
      commit("removeConversation", payLoad);
    },
    async newMessage({ commit, state, dispatch }, payLoad) {
      const conversation = state.data.find(
        (x) => x.id == payLoad.conversationId
      );
      if (!conversation) {
        await dispatch("getConversationById", payLoad.conversationId);
      } else {
        commit("newMessage", payLoad);
      }
    },
    minimizeConversation({ commit }, payLoad) {
      commit("minimizeConversation", payLoad);
    },
    showConversation({ commit }, payLoad) {
      commit("showConversation", payLoad);
    },
    async seenMessage({ commit, state }, payLoad) {
      const conversation = state.data.find((x) => x.id == payLoad);
      if (conversation) {
        const lastMessage = conversation.messages.data.pop();
        const loggedUser = tokenService.getUser();
        if (
          lastMessage &&
          !lastMessage.readedAt &&
          loggedUser.id != lastMessage.user.id
        ) {
          await conversationService.seenMessage(
            conversation.id,
            lastMessage.id
          );

          commit("seenMessage", {
            conversationId: payLoad,
            messageId: lastMessage.id,
          });
        }
      }
    },
    async changeNickName({ commit, state }, payLoad) {
      const conversation = state.data.find(
        (x) => x.id == payLoad.conversationId
      );
      if (conversation) {
        try {
          const changeNameRes = await conversationService.updateParticipant(
            conversation.id,
            payLoad.participantId,
            {
              name: payLoad.name,
            }
          );

          commit("changeNickNameSuccess", {
            conversationId: payLoad.conversationId,
            participantId: payLoad.participantId,
            data: changeNameRes.data,
          });

          return Promise.resolve({
            conversationId: payLoad.conversationId,
            participantId: payLoad.participantId,
            data: changeNameRes.data,
          });
        } catch (err) {
          console.error(err);
          toastAlert.error("Có lỗi khi đặt biệt danh");
          return Promise.reject();
        }
      }
    },
    async changeConversationName({ commit, state }, payLoad) {
      const conversation = state.data.find(
        (x) => x.id == payLoad.conversationId
      );
      if (conversation) {
        try {
          const updateRes = await conversationService.update(conversation.id, {
            name: payLoad.name,
          });
          commit("updateConversationNameSuccess", {
            conversationId: conversation.id,
            data: updateRes.data,
          });

          return Promise.resolve({
            conversationId: conversation.id,
            data: updateRes.data,
          });
        } catch (err) {
          console.error(err);
          toastAlert.error("Có lỗi khi đổi tên trò chuyện");
        }
      }
    },
    changeConversationNameWithoutFetch({ commit }, payLoad) {
      commit("updateConversationNameSuccess", payLoad);
    },
    async updateImage({ commit }, payLoad) {
      try {
        const res = await conversationService.update(payLoad.conversationId, {
          image: payLoad.url,
        });

        commit("updatedImage", {
          conversationId: payLoad.conversationId,
          images: res.data.images,
        });
      } catch (err) {
        console.error(err);
      }
    },
    reset({ commit }) {
      commit("reset");
    },
  },
  mutations: {
    getConversationSuccess(state, payLoad) {
      const messages = {
        data: [],
        pageSize: 20,
        endCursor: null,
        hasNextPage: true,
      };

      const participants = {
        data: [],
        pageSize: 10,
        pageNumber: 0,
        total: 0,
        isFetched: false,
      };

      state.data.push({
        ...payLoad.data,
        minimize: false,
        messages,
        participants,
      });
    },
    minimizeConversation(state, payLoad) {
      const conversation = state.data.find((x) => x.id == payLoad);
      if (conversation) {
        conversation.minimize = true;
      }
    },
    showConversation(state, payLoad) {
      const conversation = state.data.find((x) => x.id == payLoad);
      if (conversation) {
        conversation.minimize = false;
      }
    },
    createConversationSuccess(state, payLoad) {
      const messages = {
        data: [],
        pageSize: 20,
        endCursor: null,
        hasNextPage: true,
      };

      const participants = {
        data: [],
        pageSize: 10,
        pageNumber: 0,
        total: 0,
        isFetched: false,
      };

      state.data.push({
        ...payLoad.data,
        messages,
        participants,
      });
    },
    sendMessageSuccess(state, payLoad) {
      const conversation = state.data.find(
        (x) => x.id == payLoad.conversationId
      );
      if (conversation) {
        conversation.messages.data.push(payLoad.data);
        if (!conversation.messages.endCursor) {
          conversation.messages.endCursor = payLoad.data.createdAt;
        }
      }
    },
    getMessageSuccess(state, payLoad) {
      const conversation = state.data.find(
        (x) => x.id == payLoad.conversationId
      );
      if (conversation) {
        conversation.messages.data.unshift(...payLoad.data.reverse());
        conversation.messages.endCursor = payLoad.endCursor;
        conversation.messages.hasNextPage = payLoad.hasNextPage;
      }
    },
    newMessage(state, payLoad) {
      const conversation = state.data.find(
        (x) => x.id == payLoad.conversationId
      );
      if (conversation) {
        conversation.updatedAt = new Date();
        conversation.messages.data.push(payLoad);
      }
    },
    removeConversation(state, payLoad) {
      state.data = state.data.filter((x) => x.id != payLoad);
    },
    getParticipantSuccess(state, payLoad) {
      const conversation = state.data.find(
        (x) => x.id == payLoad.conversationId
      );
      if (conversation) {
        conversation.participants.pageNumber++;
        conversation.participants.data.push(...payLoad.data);
        conversation.participants.total = payLoad.totalItems;
        conversation.participants.isFetched = true;
      }
    },
    changeNickNameSuccess(state, payLoad) {
      const conversation = state.data.find(
        (x) => x.id == payLoad.conversationId
      );
      if (conversation) {
        const participant = conversation.participants.data.find(
          (x) => x.id == payLoad.participantId
        );

        if (participant) {
          participant.userContactName = payLoad.data.userContactName;
        }

        if (
          conversation.type == 0 &&
          participant.user.id != tokenService.getUser().id
        ) {
          conversation.name = payLoad.data.userContactName;
        }

        conversation.messages.data.forEach((item) => {
          if (item.participant.id == payLoad.participantId) {
            item.participant.userContactName = payLoad.data.userContactName;
          }
        });
      }
    },
    updateConversationNameSuccess(state, payLoad) {
      const conversation = state.data.find((x) => x.id == payLoad.id);
      if (conversation) {
        conversation.name = payLoad.name;
      }
    },
    updatedImage(state, payLoad) {
      const conversation = state.data.find(
        (x) => x.id == payLoad.conversationId
      );
      if (conversation) {
        conversation.images = payLoad.images;
      }
    },
    reset(state) {
      state.data = [];
    },
  },
  getters: {
    getData(state) {
      state.data.sort((a, b) => b.updatedAt - a.updatedAt);

      return state.data;
    },
  },
};
