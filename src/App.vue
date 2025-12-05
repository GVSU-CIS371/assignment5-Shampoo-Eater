<template>
  <div>
    <Beverage :isIced="beverageStore.currentTemp === 'Cold'" />

    <ul>
      <li>
        <template v-for="temp in beverageStore.temps" :key="temp">
          <label>
            <input
              type="radio"
              name="temperature"
              :id="`r${temp}`"
              :value="temp"
              v-model="beverageStore.currentTemp"
            />
            {{ temp }}
          </label>
        </template>
      </li>
    </ul>

    <ul>
      <li>
        <template v-for="b in beverageStore.bases" :key="b.id">
          <label>
            <input
              type="radio"
              name="bases"
              :id="`r${b.id}`"
              :value="b"
              v-model="beverageStore.currentBase"
            />
            {{ b.name }}
          </label>
        </template>
      </li>
    </ul>

    <ul>
      <li>
        <template v-for="s in beverageStore.syrups" :key="s.id">
          <label>
            <input
              type="radio"
              name="syrups"
              :id="`r${s.id}`"
              :value="s"
              v-model="beverageStore.currentSyrup"
            />
            {{ s.name }}
          </label>
        </template>
      </li>
    </ul>

    <ul>
      <li>
        <template v-for="c in beverageStore.creamers" :key="c.id">
          <label>
            <input
              type="radio"
              name="creamers"
              :id="`r${c.id}`"
              :value="c"
              v-model="beverageStore.currentCreamer"
            />
            {{ c.name }}
          </label>
        </template>
      </li>
    </ul>

    <div class="auth-row" v-if="!beverageStore.user">
      <button @click="withGoogle">Sign in with Google</button>
    </div>
    <div class="auth-row" v-else>
      <span class="user-label">Signed In As {{ beverageStore.user.displayName }}</span>
      <button @click="signOutUser">Sign Out</button>
    </div>
    <div v-if="beverageStore.user">
      <input
        v-model="beverageStore.currentName"
        type="text"
        placeholder="Beverage Name"
      />

      <button @click="handleMakeBeverage">🍺 Make Beverage</button>
    </div>
    <p v-if="message" class="status-message">
      {{ message }}
    </p>
  </div>

  <div style="margin-top: 20px">
    <template v-for="beverage in beverageStore.beverages" :key="beverage.id">
      <div id="bev-buttons" v-if="beverage.uid===beverageStore.user?.uid">
        <input
          type="radio"
          :id="beverage.id"
          :value="beverage"
          v-model="beverageStore.currentBeverage"
          @change="beverageStore.showBeverage()"
        />
        <label :for="beverage.id">{{ beverage.name }}</label>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import Beverage from "./components/Beverage.vue";
import { useBeverageStore } from "./stores/beverageStore";
import {
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged,
  signOut,
} from "firebase/auth";
import { auth } from "./firebase.ts"

const beverageStore = useBeverageStore();

const message = ref("");

const showMessage = (txt: string) => {
  message.value = txt;
  setTimeout(() => {
    message.value = "";
  }, 5000);
};

onMounted(() => {
  beverageStore.init();

  onAuthStateChanged(auth, (currentUser) => {
    beverageStore.setUser(currentUser);
  });
});

const withGoogle = async () => {
  const provider = new GoogleAuthProvider();
  try {
    await signInWithPopup(auth, provider);
  } catch (error) {
    console.error("Error during sign in:", error);
    showMessage("Failed to sign in. Please try again.");
  }
};

const signOutUser = async () => {
  await signOut(auth);
  showMessage("You have been signed out.");
};

const handleMakeBeverage = async () => {
  const txt = await beverageStore.makeBeverage();
  showMessage(txt);
};
</script>

<style lang="scss">
body,
html {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  background-color: #6e4228;
  background: linear-gradient(to bottom, #6e4228 0%, #956f5a 100%);
}

ul {
  list-style: none;
}

.auth-row {
  margin-top: 10px;
  margin-bottom: 8px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.user-label {
  color: #ffffff;
  font-size: 0.9rem;
}

.hint {
  margin-top: 4px;
  color: #ffffff;
  font-size: 0.85rem;
}

.status-message {
  margin-top: 8px;
  padding: 6px 10px;
  border-radius: 4px;
  background: #fff3cd;
  border: 1px solid #ffeeba;
  color: #856404;
  font-size: 0.9rem;
}
</style>
