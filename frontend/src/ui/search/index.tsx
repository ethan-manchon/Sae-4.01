import React from "react";

interface SearchProps {
  search: string;
  setSearch: (val: string) => void;
  filterUser: string;
  setFilterUser: (val: string) => void;
  filterType: string;
  setFilterType: (val: string) => void;
  filterDate: string;
  setFilterDate: (val: string) => void;
}

export default function Search({
  search,
  setSearch,
  filterUser,
  setFilterUser,
  filterType,
  setFilterType,
  filterDate,
  setFilterDate,
}: SearchProps) {
  return (
    <div className="mb-6">
      <input
        type="text"
        placeholder="Rechercher un tweet ..."
        value={search}
        onChange={(e) => setSearch(e.target.value.trimStart())}
        className="w-full border border-border rounded px-4 py-2 mb-2"
      />

      <div className="flex flex-wrap gap-2 mt-2">
        <select
          value={filterUser}
          onChange={(e) => setFilterUser(e.target.value)}
          className="border rounded px-3 py-2"
        >
          <option value="">Tous les utilisateurs</option>
          <option value="me">Moi</option>
          <option value="other">Autres</option>
        </select>

        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="border rounded px-3 py-2"
        >
          <option value="">Tous les types</option>
          <option value="post">Posts</option>
          <option value="repost">Reposts</option>
        </select>

        <input
          type="date"
          value={filterDate}
          onChange={(e) => setFilterDate(e.target.value)}
          className="border rounded px-3 py-2"
        />
      </div>
    </div>
  );
}
