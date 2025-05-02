import React, { useState, useCallback, useRef, useEffect } from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import { Dropdown, MultiSelect } from "react-native-element-dropdown";
import { FontAwesome6, MaterialIcons } from "@expo/vector-icons";
import { COLORS, FONTS, SIZES } from "../constants/theme";
import { useTheme } from "../contexts/ThemeProvider";
import { FlatList, TextInput } from "react-native-gesture-handler";
import { useTranslation } from "react-i18next";

/**
 * A dropdown component for selecting users with search functionality.
 * Supports both single and multiple selection modes with avatar display.
 *
 * @param {Object} props - Component props
 * @param {Array} props.data - Array of user objects containing id, name, and img properties
 * @param {Function} props.setSelectedUser - Callback to update selected user(s) in parent component
 * @param {boolean} props.multiple - Whether multiple selection is enabled
 * @param {string} props.labelField - Field name in user objects to display as label
 * @param {string} props.placeholder - Placeholder of the Selector
 * @param {string} props.searchPlaceholder - Placeholder of the search Selector input
 * @returns {JSX.Element} - Rendered dropdown component
 */
export default function SelectorDropdown({
  data,
  setSelectedData,
  labelField,
  valueField,
  multiple,
  searchPlaceholder,
  placeholder,
  selectType,
  value,
  itemID,
  translationType,
}) {
  const { theme } = useTheme();
  const { t, i18n } = useTranslation();
  const [tempData, setTempData] = useState(data);
  const [isNoSearchDataFound, setIsNoSearchDataFound] = useState(false);
  const [isFocus, setIsFocus] = useState(false);
  const [tempSelection, setTempSelection] = useState(multiple ? [] : null);
  const dropdownRef = useRef(null);
  const [searchQuery, setSearchQuery] = useState("");
  useEffect(() => {
    if (!tempSelection || tempSelection?.length === 0) return;

    if (!value || value?.length === 0) {
      setTempSelection(value);
    }
  }, [value]);

  /**
   * Update the selected data
   */
  useEffect(() => {
    if (multiple) {
      const fullData = tempSelection?.map((id) => {
        const user = data.find((u) => u?.id?.toString() === id?.toString());
        if (!user) null;
        return user;
      });

      setSelectedData(fullData, "user", selectType);
      return;
    }

    setSelectedData(tempSelection, "user", selectType);
  }, [tempSelection]);

  /**
   * Renders a selectable item in the dropdown list.
   * Displays user avatar, name, and selection status.
   *
   * @param {Object} item - User object to render
   * @returns {JSX.Element} - Rendered dropdown item
   */
  const renderItem = useCallback(
    (item) => {
      const isSelected = multiple
        ? tempSelection && tempSelection.includes(item.id)
        : tempSelection && tempSelection.id === item.id;
      return (
        <View
          style={[
            styles.item,
            {
              backgroundColor: isSelected
                ? COLORS.secondary + "90"
                : "transparent",
            },
          ]}>
          <View style={[styles.item, { padding: 0 }]}>
            {item.img && (
              <View
                style={{
                  borderColor: COLORS.primary,
                  borderWidth: 2,
                  borderRadius: 50,
                  padding: 1,
                }}>
                <Image
                  source={{
                    uri: item["img"],
                  }}
                  style={styles.avatar}
                />
              </View>
            )}
            <Text
              style={[
                styles.itemText,
                isSelected && {
                  color:
                    theme.name === "light"
                      ? COLORS.black + "90"
                      : COLORS.white + "90",
                },
              ]}>
              {item.img
                ? item?.name
                : t(`${translationType}.fields.${itemID}.options.${item.id}`)}
            </Text>
          </View>

          {isSelected && (
            <FontAwesome6
              name="user-check"
              size={SIZES.medium}
              color={
                theme.name === "light"
                  ? COLORS.black + "90"
                  : COLORS.white + "90"
              }
            />
          )}
        </View>
      );
    },
    [tempSelection, multiple, theme.name]
  );

  /**
   * Renders the horizontally scrollable list of selected users in multiple selection mode.
   * Each selected user displays avatar, name, and a remove button.
   *
   * @returns {JSX.Element|null} - Rendered list of selected users or null if no selections
   */
  const renderSelectedItems = useCallback(() => {
    if (!multiple || !tempSelection || tempSelection.length === 0) return null;

    return (
      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.selectedItemsContainer}
        data={tempSelection}
        keyExtractor={(item, index) => `selected-${item}-${index}`}
        renderItem={({ item: itemId, index }) => {
          const item = data.find((u) => u.id === itemId);
          if (!item) return null;

          return (
            <View style={styles.selectedItem} key={`selected-${item.id}`}>
              {item.img && (
                <Image source={{ uri: item.img }} style={styles.smallAvatar} />
              )}

              <Text style={[styles.selectedTextStyle, { color: theme.text }]}>
                {item[labelField]}
              </Text>
              <TouchableOpacity
                onPress={() => {
                  setTempSelection(
                    tempSelection.filter((id) => id !== item.id)
                  );
                }}
                style={styles.removeButton}>
                <MaterialIcons
                  name="close"
                  size={SIZES.medium}
                  color={COLORS.white}
                />
              </TouchableOpacity>
            </View>
          );
        }}
      />
    );
  }, [tempSelection, data, theme.text, multiple]);

  /**
   * Handles search input changes and filters the user list.
   * Updates search results and "No users found" state based on matches.
   *
   * @param {string} text - Current search query text
   */
  const handleSearch = (text) => {
    setSearchQuery(text);

    if (text.trim() === "") {
      setTempData(data);
      setIsNoSearchDataFound(false);
      return;
    }

    const filteredArray = data.filter((item) =>
      item?.[labelField]?.toLowerCase().includes(text.toLowerCase())
    );

    setTempData(filteredArray);
    setIsNoSearchDataFound(filteredArray.length === 0);
  };

  /**
   * Renders the search input field with icon, text input, and clear button.
   * Also displays "No users found" message when applicable.
   *
   * @returns {JSX.Element} - Rendered search input component
   */
  const renderInputSearch = useCallback(() => {
    return (
      <View style={{ padding: SIZES.small, gap: SIZES.small }}>
        <View
          style={{
            height: SIZES.xLarge,
            borderRadius: 10,
            borderWidth: 0.5,
            borderColor: COLORS.gray,
            flexDirection: "row",
            alignItems: "center",
            paddingInline: SIZES.small,
            paddingRight: SIZES.small,
            paddingLeft: SIZES.small,
            gap: SIZES.small,
          }}>
          <MaterialIcons
            name="search"
            size={1.4 * SIZES.medium}
            color={COLORS.gray}
          />
          <TextInput
            placeholder={searchPlaceholder || "Search ..."}
            autoCorrect={false}
            value={searchQuery}
            onChangeText={handleSearch}
            placeholderTextColor={COLORS.gray}
            autoCapitalize="none"
            style={{
              flex: 1,
              fontSize: SIZES.medium,
              color: theme.text,
              textAlign: i18n.language === "ar" ? "right" : "auto",
            }}
          />
          {searchQuery !== "" && (
            <TouchableOpacity onPress={() => handleSearch("")}>
              <MaterialIcons
                name="close"
                size={1.4 * SIZES.medium}
                color={COLORS.gray}
              />
            </TouchableOpacity>
          )}
        </View>

        {isNoSearchDataFound && (
          <View style={styles.noResultsContainer}>
            <Text style={{ color: COLORS.gray }}>No users found</Text>
          </View>
        )}
      </View>
    );
  }, [searchQuery, isNoSearchDataFound, searchPlaceholder, theme.text]);
  return (
    <View style={styles.container}>
      {multiple ? (
        <View>
          <MultiSelect
            renderInputSearch={renderInputSearch}
            ref={dropdownRef}
            style={[styles.dropdown, isFocus && styles.dropdownFocus]}
            placeholderStyle={[styles.placeholderStyle]}
            selectedTextStyle={[
              styles.selectedTextStyle,
              { color: theme.text },
            ]}
            inputSearchStyle={[styles.inputSearchStyle, { color: theme.text }]}
            containerStyle={[
              styles.dropdowContainerStyle,
              { backgroundColor: theme.background },
            ]}
            activeColor={theme.lightHover}
            mode="modal"
            backgroundColor=" rgba(0, 0, 0, 0.5)"
            iconColor={COLORS.gray}
            maxHeight={5 * SIZES.xLarge}
            labelField={labelField}
            valueField={valueField}
            placeholder={placeholder || "Search ..."}
            search={true}
            data={tempData}
            value={tempSelection}
            renderSelectedItem={() => <></>}
            renderItem={renderItem}
            onBlur={() => {
              setIsFocus(false);
            }}
            onFocus={() => {
              setIsFocus(true);
            }}
            onChange={(items) => {
              setTempSelection(items);
            }}
            renderRightIcon={() => (
              <MaterialIcons
                name={isFocus ? "keyboard-arrow-up" : "keyboard-arrow-down"}
                size={1.4 * SIZES.medium}
                color={COLORS.gray}
              />
            )}
          />

          {/* Render the scrollable selected items outside MultiSelect */}
          {renderSelectedItems()}
        </View>
      ) : (
        <Dropdown
          ref={dropdownRef}
          renderInputSearch={renderInputSearch}
          style={[styles.dropdown, isFocus && styles.dropdownFocus]}
          placeholderStyle={[styles.placeholderStyle]}
          selectedTextStyle={[styles.selectedTextStyle, { color: theme.text }]}
          inputSearchStyle={[styles.inputSearchStyle, { color: theme.text }]}
          containerStyle={[
            styles.dropdowContainerStyle,
            { backgroundColor: theme.background },
          ]}
          mode="modal"
          backgroundColor=" rgba(0, 0, 0, 0.5)"
          activeColor={theme.lightHover}
          iconColor={COLORS.gray}
          maxHeight={5 * SIZES.xLarge}
          data={tempData}
          labelField={labelField}
          valueField={valueField}
          dropdownPosition="bottom"
          placeholder={placeholder || "Search ..."}
          search={true}
          value={tempSelection}
          onBlur={() => {
            setIsFocus(false);
          }}
          onChange={(item) => {
            setTempSelection(item);
          }}
          onFocus={() => {
            setIsFocus(true);
          }}
          renderItem={renderItem}
          renderLeftIcon={() =>
            tempSelection?.img && (
              <View
                style={{
                  borderColor: COLORS.primary,
                  borderWidth: 2,
                  borderRadius: 50,
                  padding: 1,
                  marginRight: 4,
                }}>
                <Image
                  source={{ uri: tempSelection.img }}
                  style={[styles.smallAvatar]}
                />
              </View>
            )
          }
          renderRightIcon={() =>
            tempSelection?.img ? (
              <MaterialIcons
                name="close"
                onPress={() => {
                  setTempSelection(null);
                }}
                size={1.4 * SIZES.medium}
                color={COLORS.gray}
              />
            ) : (
              <MaterialIcons
                name={isFocus ? "keyboard-arrow-up" : "keyboard-arrow-down"}
                size={1.4 * SIZES.medium}
                color={COLORS.gray}
              />
            )
          }
        />
      )}
    </View>
  );
}

/**
 * Styles for the SelectorDropdown component
 */
const styles = StyleSheet.create({
  /**
   * Container for the entire component
   */
  container: {
    width: "100%",
  },
  /**
   * Base dropdown styling
   */
  dropdown: {
    padding: SIZES.medium,
    minHeight: 1.4 * SIZES.xLarge,
    borderWidth: 1,
    borderColor: COLORS.gray,
    borderRadius: 10,
  },
  /**
   * Focused state styling for dropdown
   */
  dropdownFocus: {
    borderColor: COLORS.primary,
    borderBottomEndRadius: 0,
    borderBottomStartRadius: 0,
  },
  /**
   * Container style for the dropdown popup
   */
  dropdowContainerStyle: {
    borderRadius: 10,
    maxHeight: 5 * SIZES.xLarge,
    paddingBottom: SIZES.small,
    overflow: "hidden",
  },
  /**
   * Style for the placeholder text
   */
  placeholderStyle: {
    fontSize: SIZES.medium,
    fontFamily: FONTS.medium,
    color: COLORS.gray,
  },
  /**
   * Style for selected item text
   */
  selectedTextStyle: {
    fontSize: SIZES.medium,
    fontFamily: FONTS.medium,
  },
  /**
   * Style for the search input
   */
  inputSearchStyle: {
    fontSize: SIZES.medium,
    height: SIZES.xLarge,
    borderRadius: 10,
    borderColor: COLORS.gray,
    color: COLORS.gray,
  },
  /**
   * Style for dropdown items
   */
  item: {
    padding: SIZES.small,
    paddingLeft: SIZES.small,
    paddingRight: SIZES.small,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: SIZES.small,
  },
  /**
   * Background styling for selected items
   */
  selectedItemBackground: {
    backgroundColor: "#F0F8FF",
  },
  /**
   * Style for item text
   */
  itemText: {
    fontSize: 1.1 * SIZES.medium,
    color: COLORS.gray,
    fontFamily: FONTS.medium,
  },
  /**
   * Container for selected items in multi-select mode
   */
  selectedItemsContainer: {
    flexDirection: "row",
    padding: SIZES.small,
    gap: SIZES.small,
  },
  /**
   * Style for individual selected items
   */
  selectedItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.secondary + "40",
    borderRadius: 20,
    padding: SIZES.small,
    gap: SIZES.small,
  },
  /**
   * Style for the larger avatar in dropdown items
   */
  avatar: {
    width: 1.2 * SIZES.large,
    height: 1.2 * SIZES.large,
    borderRadius: 50,
  },
  /**
   * Style for the smaller avatar in selected items
   */
  smallAvatar: {
    width: SIZES.large,
    height: SIZES.large,
    borderRadius: 50,
  },
  /**
   * Style for the remove button on selected items
   */
  removeButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: COLORS.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  /**
   * Container for "No users found" message
   */
  noResultsContainer: {
    padding: SIZES.small,
  },
});
