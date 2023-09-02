import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import axios from "axios";
import UserSearch from "./UserSearch";

jest.mock("axios");

describe("UserSearch Component", () => {
  beforeEach(() => {
    axios.mockClear();
  });

  it("renders the component correctly", () => {
    render(<UserSearch />);
    expect(screen.getByText("Github User Search")).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("Search users by name")
    ).toBeInTheDocument();
  });

  it("fetches and displays user data on input change", async () => {
    const responseData = {
      data: {
        items: [
          {
            login: "user1",
            avatar_url: "https://example.com/avatar1.jpg",
          },
          {
            login: "user2",
            avatar_url: "https://example.com/avatar2.jpg",
          },
        ],
      },
    };

    axios.get.mockResolvedValue(responseData);

    render(<UserSearch />);

    const input = screen.getByPlaceholderText("Search users by name");
    fireEvent.change(input, { target: { value: "testuser" } });

    await waitFor(() => {
      expect(axios.get).toHaveBeenCalledWith(
        expect.stringContaining("testuser")
      );
      expect(screen.getByText("user1")).toBeInTheDocument();
      expect(screen.getByText("user2")).toBeInTheDocument();
    });
  });

  it("displays 'No Data Available' when no results are found", async () => {
    axios.get.mockResolvedValue({ data: { items: [] } });

    render(<UserSearch />);

    const input = screen.getByPlaceholderText("Search users by name");
    fireEvent.change(input, { target: { value: "nonexistentuser" } });

    await waitFor(() => {
      expect(axios.get).toHaveBeenCalledWith(
        expect.stringContaining("nonexistentuser")
      );
      expect(screen.getByText("No Data Available")).toBeInTheDocument();
    });
  });
});
