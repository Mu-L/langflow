import { useContext } from "react";
import { FaDiscord, FaGithub } from "react-icons/fa";
import { RiTwitterXFill } from "react-icons/ri";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import AlertDropdown from "../../alerts/alertDropDown";
import {
  LOCATIONS_TO_RETURN,
  USER_PROJECTS_HEADER,
} from "../../constants/constants";
import { AuthContext } from "../../contexts/authContext";

import useAlertStore from "../../stores/alertStore";
import { useDarkStore } from "../../stores/darkStore";
import useFlowStore from "../../stores/flowStore";
import useFlowsManagerStore from "../../stores/flowsManagerStore";
import { useLocationStore } from "../../stores/locationStore";
import { useStoreStore } from "../../stores/storeStore";
import { gradients } from "../../utils/styleUtils";
import IconComponent from "../genericIconComponent";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Separator } from "../ui/separator";
import MenuBar from "./components/menuBar";

export default function Header(): JSX.Element {
  const notificationCenter = useAlertStore((state) => state.notificationCenter);
  const location = useLocation();

  const { logout, autoLogin, isAdmin, userData } = useContext(AuthContext);
  const navigate = useNavigate();
  const removeFlow = useFlowsManagerStore((store) => store.removeFlow);
  const hasStore = useStoreStore((state) => state.hasStore);
  const { id } = useParams();
  const nodes = useFlowStore((state) => state.nodes);

  const dark = useDarkStore((state) => state.dark);
  const setDark = useDarkStore((state) => state.setDark);
  const stars = useDarkStore((state) => state.stars);

  const routeHistory = useLocationStore((state) => state.routeHistory);

  async function checkForChanges(): Promise<void> {
    if (nodes.length === 0) {
      await removeFlow(id!);
    }
  }

  const redirectToLastLocation = () => {
    const lastFlowVisitedIndex = routeHistory
      .reverse()
      .findIndex(
        (path) => path.includes("/flow/") && path !== location.pathname
      );

    const lastFlowVisited = routeHistory[lastFlowVisitedIndex];
    lastFlowVisited && !location.pathname.includes("/flow")
      ? navigate(lastFlowVisited)
      : navigate("/all");
  };

  const visitedFlowPathBefore = () => {
    const lastThreeVisitedPaths = routeHistory.slice(-3);
    return lastThreeVisitedPaths.some((path) => path.includes("/flow/"));
  };

  const showArrowReturnIcon =
    LOCATIONS_TO_RETURN.some((path) => location.pathname.includes(path)) &&
    visitedFlowPathBefore();

  return (
    <div className="header-arrangement">
      <div className="header-start-display lg:w-[30%]">
        <Link to="/all" className="cursor-pointer" onClick={checkForChanges}>
          <span className="ml-4 text-2xl">⛓️</span>
        </Link>
        {showArrowReturnIcon && (
          <button
            onClick={() => {
              checkForChanges();
              redirectToLastLocation();
            }}
          >
            <IconComponent name="ChevronLeft" className="w-4" />
          </button>
        )}

        <MenuBar />
      </div>

      <div className="round-button-div">
        <Link to="/">
          <Button
            className="gap-2"
            variant={
              location.pathname === "/all" ||
              location.pathname === "/components"
                ? "primary"
                : "secondary"
            }
            size="sm"
            onClick={checkForChanges}
          >
            <IconComponent name="Home" className="h-4 w-4" />
            <div className="hidden flex-1 md:block">{USER_PROJECTS_HEADER}</div>
          </Button>
        </Link>

        {hasStore && (
          <Link to="/store">
            <Button
              className="gap-2"
              variant={location.pathname === "/store" ? "primary" : "secondary"}
              size="sm"
              onClick={checkForChanges}
              data-testid="button-store"
            >
              <IconComponent name="Store" className="h-4 w-4" />
              <div className="flex-1">Store</div>
            </Button>
          </Link>
        )}
      </div>
      <div className="header-end-division lg:w-[30%]">
        <div className="header-end-display">
          <a
            href="https://github.com/langflow-ai/langflow"
            target="_blank"
            rel="noreferrer"
            className="header-github-link gap-2"
          >
            <FaGithub className="h-5 w-5" />
            <div className="hidden lg:block">Star</div>
            <div className="header-github-display">{stars ?? 0}</div>
          </a>
          <a
            href="https://twitter.com/langflow_ai"
            target="_blank"
            rel="noreferrer"
            className="text-muted-foreground"
          >
            <RiTwitterXFill className="side-bar-button-size" />
          </a>
          <a
            href="https://discord.gg/EqksyE2EX9"
            target="_blank"
            rel="noreferrer"
            className="text-muted-foreground"
          >
            <FaDiscord className="side-bar-button-size" />
          </a>

          <Separator orientation="vertical" />
          <button
            className="extra-side-bar-save-disable"
            onClick={() => {
              setDark(!dark);
            }}
          >
            {dark ? (
              <IconComponent name="SunIcon" className="side-bar-button-size" />
            ) : (
              <IconComponent name="MoonIcon" className="side-bar-button-size" />
            )}
          </button>
          <AlertDropdown>
            <div className="extra-side-bar-save-disable relative">
              {notificationCenter && (
                <div className="header-notifications"></div>
              )}
              <IconComponent
                name="Bell"
                className="side-bar-button-size"
                aria-hidden="true"
              />
            </div>
          </AlertDropdown>
          {autoLogin && (
            <button
              onClick={() => {
                navigate("/account/api-keys");
              }}
            >
              <IconComponent
                name="Key"
                className="side-bar-button-size text-muted-foreground hover:text-accent-foreground"
              />
            </button>
          )}

          <>
            <Separator orientation="vertical" />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  data-testid="user-profile-settings"
                  className={
                    "h-7 w-7 rounded-full focus-visible:outline-0 " +
                    (userData?.profile_image ??
                      (userData?.id
                        ? gradients[
                            parseInt(userData?.id ?? "", 30) % gradients.length
                          ]
                        : "bg-gray-500"))
                  }
                />
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>General</DropdownMenuLabel>
                <DropdownMenuItem
                  className="cursor-pointer"
                  onClick={() => navigate("/settings")}
                >
                  Settings
                </DropdownMenuItem>
                {!autoLogin && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    {isAdmin && (
                      <DropdownMenuItem
                        className="cursor-pointer"
                        onClick={() => navigate("/admin")}
                      >
                        Admin Page
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem
                      className="cursor-pointer"
                      onClick={() => {
                        logout();
                      }}
                    >
                      Sign Out
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </>
        </div>
      </div>
    </div>
  );
}
