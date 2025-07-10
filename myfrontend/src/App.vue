<template>
  <div id="app">
    <nav class="navbar is-white navbar-enhanced sticky-navbar is-fixed-top " role="navigation" aria-label="main navigation">
      <div class="navbar-brand">
        <router-link to="/" class="navbar-item brand-item">
          <div class="brand-container">
            <span class="brand-icon">
              <i class="fas fa-store"></i>
            </span>
            <span class="brand-text">
              <span class="has-text-primary has-text-weight-bold">สั่งอาหารในโรงอาหาร</span>

            </span>
          </div>
        </router-link>

        <a
          role="button"
          class="navbar-burger burger"
          aria-label="menu"
          aria-expanded="false"
          data-target="navbarBasicExample"
          @click="toggleBurger"
          :class="{ 'is-active': showBurgerMenu }"
        >
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
        </a>
      </div>

      <div id="navbarBasicExample" class="navbar-menu" :class="{ 'is-active': showBurgerMenu }">
        <div class="navbar-start">
          <!-- You can add additional navigation items here -->
         
        </div>

        <div class="navbar-end">
          <!-- Queue Button (for logged in users) -->
          <div v-if="user" class="navbar-item">
            <router-link to="/queuedetail" class="button is-primary is-light nav-button">
              <span class="icon">
                <i class="fas fa-users"></i>
              </span>
              <span>Queue</span>
            </router-link>
          </div>

          <!-- Cart Button (for logged in users) -->
          <div v-if="user" class="navbar-item">
            <router-link to="/cartdetail" class="button is-primary nav-button cart-button">
              <span class="icon">
                <i class="fas fa-shopping-cart"></i>
              </span>
              <span>Cart</span>
              <!-- <span v-if="cartItemCount > 0" class="tag is-warning is-rounded cart-count">
                {{ cartItemCount }}
              </span> -->
            </router-link>
          </div>

          <!-- User Profile Dropdown (for logged in users) -->
          <div v-if="user" class="navbar-item has-dropdown is-hoverable">
            <a class="navbar-link user-profile">
              <figure class="image is-32x32">
                <img
                  class="is-rounded profile-avatar"
                  src="profile.jpg"
                  alt="User avatar"
                />
              </figure>
              <span class="user-name">{{ user.username }}</span>
              <span class="icon is-small">
                <i class="fas fa-chevron-down"></i>
              </span>
            </a>
            <div class="navbar-dropdown is-right">
              <router-link to="/profile" class="navbar-item">
                <span class="icon">
                  <i class="fas fa-user"></i>
                </span>
                <span>Profile</span>
              </router-link>
              <router-link to="/orders" class="navbar-item">
                <span class="icon">
                  <i class="fas fa-shopping-bag"></i>
                </span>
                <span>My Orders</span>
              </router-link>
              <router-link to="/settings" class="navbar-item">
                <span class="icon">
                  <i class="fas fa-cog"></i>
                </span>
                <span>Settings</span>
              </router-link>
              <hr class="navbar-divider" />
              <a class="navbar-item logout-item" @click="logOut">
                <span class="icon">
                  <i class="fas fa-sign-out-alt"></i>
                </span>
                <span>Log out</span>
              </a>
            </div>
          </div>

          <!-- Login/Signup Buttons (for guests) -->
          <div v-if="!user" class="navbar-item">
            <div class="buttons">
              <router-link to="/user/signup" class="button is-primary signup-button">
                <span class="icon">
                  <i class="fas fa-user-plus"></i>
                </span>
                <span><strong>Sign up</strong></span>
              </router-link>
              <router-link to="/user/login" class="button is-primary is-light login-button">
                <span class="icon">
                  <i class="fas fa-sign-in-alt"></i>
                </span>
                <span><strong>Log in</strong></span>
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </nav>

    <router-view class="mt-6"
      :key="$route.fullPath"
      @auth-change="onAuthChange"
      :user="user"
    />
  </div>
</template>

<script>
import axios from "@/plugins/axios";

export default {
  data() {
    return {
      user: null,
      showBurgerMenu: false,
      cartItemCount: 3, // Example cart count - you'll replace this with actual data
    };
  },
  mounted() {
    this.onAuthChange();
    // You would typically fetch cart items here or through a Vuex store
    // this.getCartItemCount();
  },
  methods: {
    onAuthChange() {
      const token = localStorage.getItem("token");
      if (token) {
        this.getUser();
      } else {
        this.user = null;
      }
    },
    getUser() {
      axios.get("/user/me")
        .then((res) => {
          this.user = res.data;
        })
        .catch((error) => {
          console.error("Error fetching user data:", error);
          this.user = null;
          localStorage.removeItem("token");
        });
    },
    logOut() {
      localStorage.removeItem("token");
      this.$router.push("/user/login");
      this.user = null;
      this.showBurgerMenu = false;
    },
    toggleBurger() {
      this.showBurgerMenu = !this.showBurgerMenu;
    },
    // Example method for fetching cart item count
    // getCartItemCount() {
    //   axios.get("/api/cart/count").then((res) => {
    //     this.cartItemCount = res.data.count;
    //   });
    // },
  },
};
</script>

<style>
#app {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}

/* Sticky Navbar Styling */
.sticky-navbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  background-color: rgba(255, 255, 255, 0.95) !important;
  border-bottom: 1px solid rgba(232, 232, 232, 0.8);
}

/* Add padding to body to prevent content from being hidden behind sticky navbar */
body {
  padding-top: 70px;
}

/* Enhanced Navbar Styling */
.navbar-enhanced {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border-bottom: 1px solid #e8e8e8;
  background-color: #ffffff !important;
  padding: 0.5rem 1rem;
  transition: all 0.3s ease;
}

/* Brand Styling */
.brand-item {
  padding: 0.5rem 1rem;
}

.brand-container {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.brand-icon {
  font-size: 1.5rem;
  color: #3273dc;
}

.brand-text {
  font-size: 1.25rem;
  line-height: 1.2;
}

/* Search Bar Styling */
.navbar-start .field {
  margin-bottom: 0;
}

.navbar-start .input {
  border-radius: 4px;
  border: 1px solid #dbdbdb;
  width: 250px;
}

.navbar-start .input:focus {
  border-color: #3273dc;
  box-shadow: 0 0 0 0.125em rgba(50, 115, 220, 0.25);
}

/* Navigation Buttons */
.nav-button {
  border-radius: 6px;
  font-weight: 500;
  transition: all 0.3s ease;
  position: relative;
}

.nav-button:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

/* Cart Button with Badge */
.cart-button {
  position: relative;
}

.cart-count {
  position: absolute;
  top: -8px;
  right: -8px;
  font-size: 0.75rem;
  font-weight: bold;
  min-width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.1); }
  100% { transform: scale(1); }
}

/* User Profile Styling */
.user-profile {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  transition: background-color 0.3s ease;
}

.user-profile:hover {
  background-color: rgba(245, 245, 245, 0.8);
}

.profile-avatar {
  border: 2px solid #3273dc;
  transition: border-color 0.3s ease;
}

.user-name {
  font-weight: 500;
  color: #363636;
}

/* Dropdown Styling */
.navbar-dropdown {
  border-radius: 6px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  border: 1px solid #e8e8e8;
  background-color: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
}

.navbar-dropdown .navbar-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  transition: background-color 0.3s ease;
}

.navbar-dropdown .navbar-item:hover {
  background-color: rgba(245, 245, 245, 0.8);
}

.logout-item {
  color: #ff3860;
}

.logout-item:hover {
  background-color: rgba(255, 245, 245, 0.8);
  color: #ff3860;
}

/* Login/Signup Buttons */
.login-button, .signup-button {
  border-radius: 6px;
  font-weight: 500;
  transition: all 0.3s ease;
}

.login-button:hover, .signup-button:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.buttons {
  gap: 0.5rem;
}

/* Burger Menu */
.navbar-burger {
  border-radius: 4px;
  transition: background-color 0.3s ease;
}

.navbar-burger:hover {
  background-color: rgba(245, 245, 245, 0.8);
}

/* Mobile Responsive */
@media screen and (max-width: 1023px) {
  .navbar-start .input {
    width: 100%;
  }
  
  .navbar-menu {
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    background-color: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
  }
  
  .navbar-item .buttons {
    width: 100%;
  }
  
  .navbar-item .button {
    flex: 1;
  }
  
  /* Adjust body padding for mobile */
  body {
    padding-top: 60px;
  }
}

/* Smooth transitions for all interactive elements */
.navbar-item, .navbar-link, .button {
  transition: all 0.3s ease;
}

/* Focus states for accessibility */
.navbar-item:focus-within,
.navbar-link:focus,
.button:focus {
  outline: 2px solid #3273dc;
  outline-offset: 2px;
}

/* Scroll behavior enhancement */
html {
  scroll-behavior: smooth;
}

/* Additional styling for better sticky navbar appearance */
.sticky-navbar.navbar-enhanced {
  border-bottom: 1px solid rgba(232, 232, 232, 0.6);
  box-shadow: 0 2px 20px rgba(0, 0, 0, 0.08);
}
</style>