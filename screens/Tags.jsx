//
// Tags.jsx
// This component is responsible for displaying a list of tags related to anomaly reports.
// It includes a search bar, filter options, and a button to add new tags.
// It uses React Native's FlatList to render the list of tags.
// It also includes a loading state and handles refreshing the list of tags.
// It uses the useTranslation hook for internationalization and the useTheme hook for theming.
// It also includes a custom button component for handling button presses.
// It fetches the tags from an API and applies sorting and filtering based on user input.
// It uses the date-fns library for date formatting and parsing.
// It also includes a custom bottom sheet component for displaying filter options.
//

import { Ionicons } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  Text,
  StyleSheet,
  SafeAreaView,
  Keyboard,
  View,
  Modal,
  Image,
  RefreshControl,
} from "react-native";
import { COLORS, FONTS, SIZES, THEME } from "../constants/theme";
import { useTheme } from "../hooks/useTheme";
import MyButton from "../components/MyButton";
import CustomBottomSheet from "../components/CustomBottomSheet";
import { TAGFILTERDATA, TAGS } from "../constants/data";
import {
  FlatList,
  GestureHandlerRootView,
  ScrollView,
} from "react-native-gesture-handler";
import CustomDateTimePicker from "../components/CustomDateTimePicker";
import { initialFilters } from "../constants/initialStates";
import Card from "../components/card/Card";
import { FlashList } from "@shopify/flash-list";
import { formatDate, parse } from "date-fns";
import TagFpsHeader from "../components/TagFpsHeader";
import SearchFilter from "../components/SearchFilter";
import { useTranslation } from "react-i18next";
import { useNavigation } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { fetchTags } from "../utils/api/tagApi";
import { DotIndicator } from "react-native-indicators";
import { noTagsImage } from "../constants/dataImage";

/**
 * Home Screen Component
 * Displays a searchable and filterable list of anomaly report tags
 * Includes search functionality, multiple filter options, and sorting capabilities
 */
export default function Tags({}) {
  const { theme } = useTheme();
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();
  const [tags, setTags] = useState([]);
  const [filterSelectedTags, setFilterSelectedTags] = useState([]);
  const [initialTags, setInitialTags] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilters, setSelectedFilters] = useState(initialFilters);
  const [isFilterModalVisible, setFilterModalVisible] = useState(false);
  const listRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [isFilterActive, setIsFilterActive] = useState(false);
  console.log("tags", tags);
  // Map for category translation
  const categoryMap = {
    security: t("cardDetails.category.security"),
    production: t("cardDetails.category.production"),
    maintenance: t("cardDetails.category.maintenance"),
    quality: t("cardDetails.category.quality"),
  };
  // Map for priority translation
  const priorityMap = {
    normal: t("cardDetails.priority.options.normal"),
    urgent: t("cardDetails.priority.options.urgent"),
    "t.urgent": t("cardDetails.priority.options.t_urgent"),
  };

  useEffect(() => {
    if (selectedFilters !== initialFilters) {
      setIsFilterActive(true);
    } else {
      setIsFilterActive(false);
    }
  }, [selectedFilters]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadTags();
  }, []);

  /**
   * Initializes tag sorting on component mount
   * Applies default sorting to the initial tag list
   */
  const loadTags = async () => {
    try {
      const tagsData = await fetchTags();
      console.log("tagsData", tagsData);
      setTags(sortHandle(tagsData));
      setInitialTags(tagsData);
    } catch (error) {
      console.error("Failed to load tags:", error);
    } finally {
      setRefreshing(false);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadTags();
  }, []);

  /**
   * Opens the filter modal and dismisses keyboard
   * Triggered when user clicks the filter icon
   */
  const handleFilterPress = () => {
    setFilterModalVisible(true);

    Keyboard.dismiss();
  };

  /**
   * Go to add Tag Page and dismisses keyboard
   * Triggered when user clicks the add icon
   */
  const handleAddPress = () => {
    Keyboard.dismiss();
    navigation.navigate("CreateTask");
  };

  /**
   * Clears the search input and resets filtered results
   * Also scrolls the list back to top
   */
  const clearSearchInputHandler = () => {
    setSearchQuery("");
    setTags(filterSelectedTags.length === 0 ? initialTags : filterSelectedTags);
    // setTags(tags);
    scrollToListTop();
  };

  /**
   * Closes the filter modal without applying changes
   * Currently commented out filter reset functionality
   */
  const closeBtnHandler = () => {
    // setSelectedFilters(initialFilters); // Commented out to preserve filter state on close
    setFilterModalVisible(false);
  };

  /**
   * Resets all filters and date selections to their initial states
   * Triggered by the reset button in filter modal
   */
  const resetBtnHandler = () => {
    setSelectedFilters(initialFilters);
  };

  /**
   * Applies selected filters and updates tag lists
   * Maintains two filtered lists:
   * - One with search query applied
   * - One without search query for subsequent filtering
   * Closes the filter modal and scrolls to top after applying
   */
  const applyBtnHandler = () => {
    const filteredWithSearch = filterTags(initialTags, true);
    const filteredWithoutSearch = filterTags(initialTags, false);

    setFilterSelectedTags(filteredWithoutSearch);
    setTags(filteredWithSearch);
    // setTags((tags));
    setFilterModalVisible(false);
    scrollToListTop();
  };

  /**
   * Scrolls the tag list to the top
   * Uses FlashList's scrollToIndex method with animation
   */
  const scrollToListTop = () => {
    listRef.current?.scrollToIndex({
      index: 0,
      animated: true,
    });
  };

  /**
   * Filters tags based on search query text
   * Matches against category, priority, and tag number
   * @param {string} text - Search query to filter tags
   */
  const searchFilterHandler = (text) => {
    const searchText = text?.toLowerCase().trim();

    let filteredTags =
      filterSelectedTags.length === 0 ? initialTags : filterSelectedTags;

    filteredTags = filteredTags.filter((tag) => {
      const translatedCategory =
        categoryMap[tag?.category?.toLowerCase()] || "";
      const translatedPriority =
        priorityMap[tag?.priority?.toLowerCase()] || "";
      const tagId = tag?.tagId || "";

      return (
        translatedCategory.toLowerCase().includes(searchText) ||
        translatedPriority.toLowerCase().includes(searchText) ||
        tagId.toLowerCase().includes(searchText)
      );
    });

    setTags(filteredTags);
    scrollToListTop();
  };

  /**
   * Handles selection/deselection of filter items
   * Manages different filter types: sort, date, categories, priority, status
   * @param {object} item - Filter item to toggle
   * @param {string} filterType - Type of filter (sort, date, categories, priority, status)
   * @param {string} dateItemType - Type of data value (selectedFromDate , ...)
   */
  const handleSelectedFilterItems = (item, filterType, dateItemType) => {
    if (filterType === "sort" || filterType === "date") {
      setSelectedFilters((oldState) => ({
        ...oldState,
        [filterType]: dateItemType // Type of data value (selectedFromDate , ...)
          ? {
              ...oldState[filterType],
              [dateItemType]: item,
            }
          : item,
      }));
      return;
    }

    const isAlreadySelected = selectedFilters[filterType].some(
      (selectedItem) => selectedItem.id === item.id
    );

    if (isAlreadySelected) {
      const filteredArray = selectedFilters[filterType].filter((arrayItem) => {
        return arrayItem.id !== item.id;
      });

      setSelectedFilters((oldState) => ({
        ...oldState,
        [filterType]: filteredArray,
      }));
    } else {
      setSelectedFilters((oldState) => ({
        ...oldState,
        [filterType]: [...oldState[filterType], item],
      }));
    }
  };

  /**
   * Sorts tags based on selected sort criteria
   * Supports sorting by date, priority level, and progress status
   * @param {Array} data - Array of tags to sort
   * @returns {Array} Sorted array of tags
   */
  const sortHandle = (data) => {
    data.reverse().sort((firstItem, secondItem) => {
      if (selectedFilters.sort == "1") {
        return new Date(secondItem.createdAt) - new Date(firstItem.createdAt);
      } else if (selectedFilters.sort == "2") {
        return new Date(firstItem.createdAt) - new Date(secondItem.createdAt);
      }

      const firstItemPriority = calculatePriorityValue(
        selectedFilters.sort,
        firstItem
      );

      const secondItemPriority = calculatePriorityValue(
        selectedFilters.sort,
        secondItem
      );

      return firstItemPriority - secondItemPriority;
    });
    return data;
  };

  /**
   * Calculates priority value for sorting
   * Assigns numerical values based on different sorting criteria
   * @param {number} priorityType - Type of priority sorting
   * @param {object} item - Tag item to calculate priority for
   * @returns {number} Priority value for sorting
   */
  const calculatePriorityValue = (priorityType, item) => {
    let priorityScore;

    switch (priorityType) {
      case 1: // Priority based on newest uploaded date
        priorityScore = parseDate(item?.createdAt, "MMM dd, yyyy");
        break;

      case 2: // Priority based on oldest uploaded date
        priorityScore = parseDate(item?.createdAt, "MMM dd, yyyy");
        break;

      case 3: // Priority based on priority level (T.Urgent => Urgent => Normal)
        switch (item?.priority?.toLowerCase()) {
          case "normal":
            priorityScore = 3;
            break;
          case "urgent":
            priorityScore = 2;
            break;
          case "t.urgent":
            priorityScore = 1;
            break;
          default:
            break;
        }
        break;

      case 4: // Priority based on progress status (resolved -> open)
        switch (item?.status?.toLowerCase()) {
          case "resolved":
            priorityScore = 1;
            break;
          case "in progress":
            priorityScore = 2;
            break;
          case "open":
            priorityScore = 3;
            break;
          default:
            break;
        }
        break;

      case 5: // Priority based on progress status (open -> resolved)
        switch (item?.status?.toLowerCase()) {
          case "open":
            priorityScore = 1;
            break;
          case "in progress":
            priorityScore = 2;
            break;
          case "resolved":
            priorityScore = 3;
            break;
          default:
            break;
        }
        break;

      default:
        break;
    }

    return priorityScore;
  };

  /**
   * Filters tags based on selected filter criteria
   * Applies category, priority, status, and search filters
   * @param {Array} tag - Array of tags to filter
   * @param {boolean} withSearch - Whether to include search query in filtering
   * @returns {Array} Filtered and sorted array of tags
   */
  const filterTags = (tags, withSearch) => {
    let filtredData = [];

    filtredData = tags.filter((tag) => {
      const tagProps = {
        category: tag?.category?.toLowerCase() || "",
        priority: tag?.priority?.toLowerCase() || "",
        status: tag?.status.toLowerCase() || "",
        tagId: tag?.tagId?.toLowerCase() || "",
        date: new Date(tag?.createdAt) || "",
        search: withSearch
          ? tag?.category?.toLowerCase().includes(searchQuery?.toLowerCase()) ||
            tag?.priority?.toLowerCase().includes(searchQuery?.toLowerCase()) ||
            tag?.tagId?.toLowerCase().includes(searchQuery?.toLowerCase())
          : true,
      };
      console.log("tagProps", tagProps);
      const categoryMatch =
        selectedFilters.categories.length === 0 ||
        selectedFilters.categories.some(
          (filter) => filter?.name?.toLowerCase() === tagProps.category
        );
      console.log("categoryMatch", categoryMatch);
      const priorityMatch =
        selectedFilters.priority.length === 0 ||
        selectedFilters.priority.some(
          (filter) => filter?.name?.toLowerCase() === tagProps.priority
        );

      const statusMatch =
        selectedFilters.status.length === 0 ||
        selectedFilters.status.some(
          (filter) => filter?.name?.toLowerCase() === tagProps.status
        );

      const selectedToDate = selectedFilters.date.selectedToDate || new Date();

      const dateMatch =
        tagProps.date >= selectedFilters.date.selectedFromDate &&
        tagProps.date <= selectedToDate;

      return (
        categoryMatch &&
        priorityMatch &&
        statusMatch &&
        tagProps.search &&
        dateMatch
      );
    });
    console.log("filtredData", filtredData);
    // const sortedData = sortHandle(filtredData);

    return filtredData;
  };

  /**
   * Parses date string to Date object
   * @param {string} dateString - Date string to parse
   * @param {string} type - Format string of the date (e.g., "MMM dd, yyyy")
   * @returns {Date} Parsed Date object
   */
  const parseDate = (dateString, type) => {
    const date = parse(dateString, type, new Date());
    return date;
  };

  return (
    <SafeAreaView
      style={[styles.container, { paddingTop: SIZES.small + insets.top }]}>
      <TagFpsHeader text={t("tagsReporting.headerTitle")}>
        <Ionicons
          name={"pricetags-outline"}
          size={SIZES.large * 0.8}
          color={theme.text}
        />
      </TagFpsHeader>

      <SearchFilter
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        handleFilterPress={handleFilterPress}
        handleAddPress={handleAddPress}
        searchFilterHandler={searchFilterHandler}
        clearSearchInputHandler={clearSearchInputHandler}
        searchPlaceholder={t("tagsReporting.searchPlaceholder")}
      />

      {/* card list  */}

      <View style={{ flex: 1 }}>
        {isLoading ? (
          <View style={styles.indicatorContainer}>
            <DotIndicator
              color={COLORS.secondary}
              count={3}
              size={SIZES.medium}
            />
          </View>
        ) : tags?.length > 0 ? (
          <FlashList
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                colors={[theme.text]}
                progressBackgroundColor={theme.background}
              />
            }
            ref={listRef}
            data={tags}
            keyExtractor={(item, index) => index.toString()}
            showsVerticalScrollIndicator={false}
            ItemSeparatorComponent={() => (
              <View style={{ height: SIZES.medium }} />
            )}
            contentContainerStyle={styles.tagsContentContainer}
            estimatedItemSize={200}
            renderItem={({ item: itemData, index }) => {
              return (
                <Card
                  cardData={itemData}
                  preventData={[
                    "deadline",
                    "actions",
                    "images",
                    "machine",
                    "equipment",
                  ]}
                />
              );
            }}
          />
        ) : (
          <ScrollView
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                colors={[theme.text]}
                progressBackgroundColor={theme.background}
              />
            }>
            {isFilterActive ? (
              <View style={styles.noDataContainer}>
                <Image source={noTagsImage} style={styles.noTagsImg} />
                <Text style={[styles.noTagsTitle, { color: theme.text }]}>
                  {t("tagsReporting.no_tags_filtered")}
                </Text>
                <Text style={styles.noTagsText}>
                  {t("tagsReporting.reset_filter")}
                </Text>
              </View>
            ) : (
              <View style={styles.noDataContainer}>
                <Image source={noTagsImage} style={styles.noTagsImg} />
                <Text style={[styles.noTagsTitle, { color: theme.text }]}>
                  {t("tagsReporting.no_tags")}
                </Text>
                <Text style={styles.noTagsText}>
                  {t("tagsReporting.check_back_tags")}
                </Text>
              </View>
            )}
          </ScrollView>
        )}
      </View>

      {/* Filter */}

      <Modal
        transparent
        visible={isFilterModalVisible}
        statusBarTranslucent
        onRequestClose={() => {
          setFilterModalVisible(false);
        }}>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <CustomBottomSheet
            isVisible={isFilterModalVisible}
            overlay={true}
            backgroundBorderRaduis={20}
            onClose={() => setFilterModalVisible(false)}>
            <View style={styles.modalContainer}>
              <View style={styles.customHandle} />
              <View style={[styles.filterHeader]}>
                <Text style={[styles.title, { color: theme.text }]}>
                  {t("tagsReporting.filter.title")}
                </Text>
                <MyButton pressHandler={closeBtnHandler}>
                  <Text style={[styles.text, { color: theme.text }]}>
                    {t("tagsReporting.filter.close")}
                  </Text>
                </MyButton>
              </View>

              <View style={styles.filterContent}>
                {/* category */}
                <View style={styles.filterItem}>
                  <Text style={[styles.title, { color: theme.text }]}>
                    {t(`tagsReporting.filter.category.sectionName`)}
                  </Text>
                  <FlatList
                    data={TAGFILTERDATA?.CATEGORIES?.data}
                    keyExtractor={(item) => item.id.toString()}
                    horizontal={true}
                    nestedScrollEnabled={true}
                    contentContainerStyle={styles.filterBoxContainer}
                    showsHorizontalScrollIndicator={false}
                    renderItem={({ item }) => {
                      const isSelected = selectedFilters.categories.some(
                        (selectedItem) => selectedItem.id === item.id
                      );
                      return (
                        <MyButton
                          noOpacity={true}
                          pressHandler={() =>
                            handleSelectedFilterItems(item, "categories")
                          }>
                          <View
                            style={{
                              backgroundColor: isSelected
                                ? item.bgColor
                                : "transparent",
                              padding: SIZES.small,
                              borderRadius: 10,
                              borderWidth: 0.5,

                              borderColor: isSelected
                                ? item.color
                                : COLORS.lightGray,
                            }}>
                            <Text
                              style={{
                                color: isSelected ? item.color : COLORS.gray,
                                fontFamily: FONTS.medium,
                              }}>
                              {t(
                                `tagsReporting.filter.category.options.${item.id}`
                              )}
                            </Text>
                          </View>
                        </MyButton>
                      );
                    }}
                  />
                </View>

                {/* priority*/}
                <View style={styles.filterItem}>
                  <Text style={[styles.title, { color: theme.text }]}>
                    {t(`tagsReporting.filter.priority.sectionName`)}
                  </Text>
                  <FlatList
                    data={TAGFILTERDATA?.PRIORITY?.data}
                    keyExtractor={(item) => item.id.toString()}
                    horizontal={true}
                    nestedScrollEnabled={true}
                    contentContainerStyle={styles.filterBoxContainer}
                    showsHorizontalScrollIndicator={false}
                    renderItem={({ item }) => {
                      const isSelected = selectedFilters.priority.some(
                        (selectedItem) => selectedItem.id === item.id
                      );
                      return (
                        <MyButton
                          noOpacity={true}
                          pressHandler={() =>
                            handleSelectedFilterItems(item, "priority")
                          }>
                          <View
                            style={{
                              backgroundColor: isSelected
                                ? COLORS.primary
                                : "transparent",
                              padding: SIZES.small,
                              borderRadius: 10,
                              borderWidth: 0.5,

                              borderColor: isSelected
                                ? COLORS.primary
                                : COLORS.lightGray,
                            }}>
                            <Text
                              style={{
                                color: isSelected ? COLORS.white : COLORS.gray,
                                fontFamily: FONTS.medium,
                              }}>
                              {t(
                                `tagsReporting.filter.priority.options.${item.id}`
                              )}
                            </Text>
                          </View>
                        </MyButton>
                      );
                    }}
                  />
                </View>

                {/* status*/}
                <View style={styles.filterItem}>
                  <Text style={[styles.title, { color: theme.text }]}>
                    {t(`tagsReporting.filter.status.sectionName`)}
                  </Text>
                  <FlatList
                    data={TAGFILTERDATA?.STATUS?.data}
                    keyExtractor={(item) => item.id.toString()}
                    horizontal={true}
                    nestedScrollEnabled={true}
                    contentContainerStyle={styles.filterBoxContainer}
                    showsHorizontalScrollIndicator={false}
                    renderItem={({ item }) => {
                      const isSelected = selectedFilters.status.some(
                        (selectedItem) => selectedItem.id === item.id
                      );
                      return (
                        <MyButton
                          noOpacity={true}
                          pressHandler={() =>
                            handleSelectedFilterItems(item, "status")
                          }>
                          <View
                            style={{
                              backgroundColor: isSelected
                                ? COLORS.primary
                                : "transparent",
                              padding: SIZES.small,
                              borderRadius: 10,
                              borderWidth: 0.5,
                              borderColor: isSelected
                                ? COLORS.primary
                                : COLORS.lightGray,
                            }}>
                            <Text
                              style={{
                                color: isSelected ? COLORS.white : COLORS.gray,
                                fontFamily: FONTS.medium,
                              }}>
                              {t(
                                `tagsReporting.filter.status.options.${item.id}`
                              )}
                            </Text>
                          </View>
                        </MyButton>
                      );
                    }}
                  />
                </View>

                {/* date */}
                <View style={styles.filterItem}>
                  <Text style={[styles.title, { color: theme.text }]}>
                    {t(`tagsReporting.filter.date.sectionName`)}
                  </Text>

                  <ScrollView
                    horizontal={true}
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={[styles.filterBoxContainer]}>
                    <MyButton
                      pressHandler={() =>
                        handleSelectedFilterItems(
                          true,
                          "date",
                          "isFromDatePickerVisible"
                        )
                      }>
                      <View style={[styles.dateButton]}>
                        <Text style={styles.dateButtonText}>
                          {formatDate(
                            selectedFilters?.date?.selectedFromDate,
                            "MM-dd-yyyy"
                          )}
                        </Text>
                        <Ionicons
                          name="calendar-outline"
                          style={styles.dateButtonIcon}
                        />
                      </View>
                    </MyButton>
                    <Text style={styles.dateButtonText}>
                      {t(`tagsReporting.filter.date.to`)}
                    </Text>
                    <MyButton
                      pressHandler={() =>
                        handleSelectedFilterItems(
                          true,
                          "date",
                          "isToDatePickerVisible"
                        )
                      }>
                      <View style={[styles.dateButton]}>
                        <Text style={styles.dateButtonText}>
                          {selectedFilters?.date?.selectedToDate
                            ? formatDate(
                                selectedFilters?.date?.selectedToDate,
                                "MM-dd-yyyy"
                              )
                            : t(`tagsReporting.filter.date.today`)}
                        </Text>
                        <Ionicons
                          name="calendar-outline"
                          style={styles.dateButtonIcon}
                        />
                      </View>
                    </MyButton>
                  </ScrollView>

                  {/* Date & Time component Handler */}

                  <View style={{ position: "absolute", width: 0, height: 0 }}>
                    <CustomDateTimePicker
                      pickerMode="date"
                      isVisible={selectedFilters?.date?.isFromDatePickerVisible}
                      setIsVisible={handleSelectedFilterItems}
                      selectedDate={selectedFilters?.date?.selectedFromDate}
                      setSelectedDate={handleSelectedFilterItems}
                      dateStateField="selectedFromDate"
                      visibilityStateField="isFromDatePickerVisible"
                      // pickerMode="date"
                      // isVisible={isFromDatePickerVisible}
                      // setIsVisible={setIsFromDatePickerVisible}
                      // selectedDate={selectedFilters?.date?.selectedFromDate}
                      // setSelectedDate={handleSelectedFilterItems}
                    />

                    <CustomDateTimePicker
                      pickerMode="date"
                      isVisible={selectedFilters?.date?.isToDatePickerVisible}
                      setIsVisible={handleSelectedFilterItems}
                      selectedDate={selectedFilters?.date?.selectedToDate}
                      setSelectedDate={handleSelectedFilterItems}
                      dateStateField="selectedToDate"
                      visibilityStateField="isToDatePickerVisible"
                    />
                  </View>
                </View>

                {/* Sort*/}

                <View style={styles.filterItem}>
                  <Text style={[styles.title, { color: theme.text }]}>
                    {t(`tagsReporting.filter.sortBy.sectionName`)}
                  </Text>
                  <View
                    style={{
                      paddingInline: SIZES.small,
                      overflow: "hidden",
                      flexDirection: "row",
                      alignItems: "center",
                      width: "65%",
                    }}>
                    <Picker
                      selectedValue={selectedFilters.sort}
                      style={{
                        marginTop: -16,
                        marginBottom: -16,
                        flex: 1,
                        color: theme.text,
                      }}
                      dropdownIconColor={theme.text}
                      dropdownIconRippleColor={theme.lightGray}
                      mode="dialog"
                      onValueChange={(itemValue) =>
                        handleSelectedFilterItems(itemValue, "sort")
                      }>
                      {TAGFILTERDATA?.SORT_BY?.data.map((item, index) => {
                        return (
                          <Picker.Item
                            key={index}
                            label={t(
                              `tagsReporting.filter.sortBy.options.${item.id}`
                            )}
                            value={item.id}
                            style={{ color: COLORS.black }}
                          />
                        );
                      })}
                    </Picker>
                  </View>
                </View>
              </View>
              {/* buttons*/}

              <View style={[styles.filterButtons]}>
                <MyButton
                  parentStyle={styles.parentStyle}
                  pressHandler={resetBtnHandler}>
                  <View style={styles.resetButton}>
                    <Text
                      style={[
                        styles.text,
                        { color: theme.text, fontSize: 1.2 * SIZES.medium },
                      ]}>
                      {t(`tagsReporting.filter.buttons.resetFilter`)}
                    </Text>
                  </View>
                </MyButton>
                <MyButton
                  parentStyle={styles.parentStyle}
                  pressHandler={applyBtnHandler}>
                  <View style={styles.applyButton}>
                    <Text
                      style={[
                        styles.text,
                        { color: COLORS.white, fontSize: 1.2 * SIZES.medium },
                      ]}>
                      {t(`tagsReporting.filter.buttons.applyFilter`)}
                    </Text>
                  </View>
                </MyButton>
              </View>
            </View>
          </CustomBottomSheet>
        </GestureHandlerRootView>
      </Modal>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: SIZES.medium,
    gap: SIZES.medium,
  },

  //  filter style
  arabicStyle: {
    alignItems: "flex-end",
  },
  //  filter style

  filterBoxContainer: {
    alignItems: "center",
    flexDirection: "row",
    gap: SIZES.small,
    paddingInline: SIZES.small,
  },

  dateButton: {
    backgroundColor: "transparent",
    padding: SIZES.small,
    borderRadius: 10,
    borderWidth: 0.5,
    borderColor: COLORS.lightGray,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: 3 * SIZES.xLarge,
  },

  dateButtonText: {
    fontFamily: FONTS.regular,
    color: COLORS.gray,
  },

  dateButtonIcon: {
    fontFamily: FONTS.regular,
    color: COLORS.gray,
    fontSize: 1.5 * SIZES.medium,
  },

  filterButtons: {
    flexDirection: "row",
    gap: SIZES.medium,
  },
  parentStyle: {
    flex: 1,
  },
  applyButton: {
    borderWidth: 1,
    backgroundColor: COLORS.primary,
    padding: SIZES.medium,
    borderRadius: 10,
    alignItems: "center",
    borderColor: COLORS.primary,
  },

  resetButton: {
    borderWidth: 1,
    borderColor: COLORS.primary,
    padding: SIZES.medium,
    borderRadius: 10,
    alignItems: "center",
  },

  // filter Modal

  modalContainer: {
    padding: SIZES.small,
    gap: 0.8 * SIZES.large,
  },

  filterHeader: {
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
  },

  title: {
    fontSize: 1.3 * SIZES.medium,
    fontFamily: FONTS.regular,
  },

  text: {
    fontSize: SIZES.medium,
    fontFamily: FONTS.regular,
  },

  filterContent: {
    gap: SIZES.medium,
  },

  filterItem: {
    gap: SIZES.small,
    alignItems: "flex-start",
  },

  customHandle: {
    width: SIZES.xLarge,
    height: 0.4 * SIZES.small,
    backgroundColor: COLORS.lightGray,
    borderRadius: 3,
    alignSelf: "center",
  },

  tabBar: {
    height: SIZES.large * 2.3,
    borderRadius: SIZES.large * 1.5,
    marginBottom: SIZES.medium,
    marginTop: -SIZES.small,
    marginInline: SIZES.small,
    elevation: 0,
  },
  // main content

  noDataFound: {
    textAlign: "center",
    fontFamily: FONTS.regular,
    fontSize: SIZES.large,
  },
  indicatorContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  // no tags
  noDataContainer: {
    flex: 1,
    paddingTop: 1.5 * SIZES.xLarge,
    alignItems: "center",
    gap: SIZES.small,
  },
  noTagsImg: {
    width: 5 * SIZES.xLarge,
    height: 5 * SIZES.xLarge,
    resizeMode: "cover",
  },
  indicatorContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  noTagsTitle: {
    fontSize: SIZES.large,
    fontFamily: FONTS.medium,
    textAlign: "center",
  },
  noTagsText: {
    fontSize: SIZES.medium,
    fontFamily: FONTS.regular,
    textAlign: "center",
    color: COLORS.gray,
  },
});
