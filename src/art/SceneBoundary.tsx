// A 3D layer that throws falls back to its still instead of blanking the app.
import { Component, type ReactNode } from "react";

type Props = { fallback?: ReactNode; children: ReactNode };

export default class SceneBoundary extends Component<
  Props,
  { failed: boolean }
> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  render() {
    return this.state.failed
      ? (this.props.fallback ?? null)
      : this.props.children;
  }
}
