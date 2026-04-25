const React = require("react")

const motion = new Proxy(
  {},
  {
    get: (_, tag) =>
      React.forwardRef(({ children, ...props }, ref) =>
        React.createElement(tag, { ...props, ref }, children)
      ),
  }
)

const AnimatePresence = ({ children }) => children

module.exports = { motion, AnimatePresence }
